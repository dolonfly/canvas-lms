# frozen_string_literal: true

#
# Copyright (C) 2015 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.
#

module LiveEvents
  # TODO: Consider refactoring out common functionality from this and
  # CanvasPandaPub::AsyncWorker. Their semantics are a bit different so
  # it may not make sense.

  class AsyncWorkerForKafka
    attr_accessor :logger, :kafka_brokers_client, :kafka_broker_topic

    MAX_BYTE_THRESHOLD = 5_000_000
    KINESIS_RECORD_SIZE_LIMIT = 1_000_000
    RETRY_LIMIT = 3

    def initialize(start_thread = true, kafka_brokers_client:, kafka_broker_topic:)
      @queue = Queue.new
      @logger = LiveEvents.logger
      @kafka_brokers_client = kafka_brokers_client
      @kafka_broker_topic = kafka_broker_topic

      start! if start_thread
    end

    def push(event, partition_key = SecureRandom.uuid)
      if @queue.length >= LiveEvents.max_queue_size
        return false
      end

      event_json = event.to_json
      total_bytes = event_json.bytesize + partition_key.bytesize
      if total_bytes > KINESIS_RECORD_SIZE_LIMIT
        logger.error("Record size greater than #{KINESIS_RECORD_SIZE_LIMIT}")
        return false
      end

      @queue << ({
        data: event_json,
        partition_key:,
        statsd_prefix: "live_events.events",
        tags: { event: event.dig(:attributes, :event_name) || "event_name_not_found" },
        total_bytes:
      })
      true
    end

    def stopped?
      @thread.nil? || !@thread.alive?
    end

    def stop!
      logger.info("Draining live events queue")
      @running = false
      # activate the thread so it won't error on join
      @queue << :stop
      @thread.join
      logger.info("Live events async worker stopped")
    end

    def start!
      return if @running

      @thread = Thread.new { run_thread }
      @running = true
      at_exit { stop! unless stopped? }
    end

    def run_thread
      loop do
        return unless @running || !@queue.empty?

        # pause thread so it will allow main thread to run
        r = @queue.pop if @queue.empty?

        begin
          # r will be nil on first pass
          records = [r].compact
          total_bytes = (r.is_a?(Hash) && r[:total_bytes]) || 0
          while !@queue.empty? && total_bytes < MAX_BYTE_THRESHOLD
            r = @queue.pop
            break if r == :stop || (records.size == 1 && records.first == :stop)

            if r[:total_bytes] + total_bytes > MAX_BYTE_THRESHOLD
              # put back on queue, will overflow kinesis put byte limit
              @queue << r
            else
              records << r
            end
            total_bytes += r[:total_bytes]
          end
          send_events(records)
        rescue => e
          logger.error("Exception making LiveEvents async call: #{e}\n#{e.backtrace.first}")
        end
        LiveEvents.on_work_unit_end&.call
      end
    end

    private

    def time_block
      res = nil
      if LiveEvents.statsd.nil?
        res = yield
      else
        LiveEvents.statsd.time("live_events.put_records") do
          res = yield
        end

      end
    end

    def send_events(records)
      return if records.empty?
      return if records.include? :stop

      res = time_block do

        records.each do |record|
          @kafka_brokers_client.produce(record[:data].to_json, topic: @kafka_broker_topic, partition_key: record[:partition_key])
        end

        # `#deliver_messages` will return immediately.
        @kafka_brokers_client.deliver_messages

      end
      process_results(res, records)
    end

    def process_results(res, records)
      records.each_with_index do |r, i|
        record = records[i]
          LiveEvents.statsd&.increment("#{record[:statsd_prefix]}.sends", tags: record[:tags])
      end
    end

    def log_unprocessed(record, error_code, error_message)
      logger.error(
        "Error posting event #{record.dig(:tags, :event)} with partition key #{record[:partition_key]}. Error Code: #{error_code} | Error Message: #{error_message}"
      )
      logger.debug(
        "Failed event data: #{record[:data]}"
      )
      LiveEvents.statsd&.increment(
        "#{record[:statsd_prefix]}.send_errors",
        tags: record[:tags].merge(error_code:)
      )
    end
  end
end
