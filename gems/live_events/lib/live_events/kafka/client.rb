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

require "json"
require "active_support"
require "active_support/core_ext/object/blank"
require 'kafka'

module LiveEvents
  class ClientForKafka
    ATTRIBUTE_BLACKLIST = [:compact_live_events].freeze

    attr_reader :kafka_brokers_client, :kafka_broker_topic

    def self.config
      res = LiveEvents.settings

      return nil unless res && res['kafka_seed_brokers'].present? && res['kafka_broker_topic'].present?

      # unless (defined?(Rails) && Rails.env.production?) ||
      #        res["custom_aws_credentials"] ||
      #        (res["aws_access_key_id"].present? && res["aws_secret_access_key_dec"].present?)
      #   # Creating Kinesis client with no creds will hang if can't connect to AWS to get creds
      #   LiveEvents.logger&.warn(
      #     "LIVE EVENTS: no creds given for kinesis in non-prod environment. Disabling."
      #   )
      #   return nil
      # end

      res.dup
    end

    def initialize(config = nil, kafka_brokers_client = nil, kafka_broker_topic = nil, worker: nil)
      config ||= LiveEvents::ClientForKafka.config
      @kafka_brokers_client = kafka_brokers_client || Kafka.new(config["kafka_seed_brokers"], client_id: "canvas-lms-application", resolve_seed_brokers: true).async_producer(
        # Trigger a delivery once 100 messages have been buffered.
        delivery_threshold: 100,

        # Trigger a delivery every 30 seconds.
        delivery_interval: 10,
      )
      @kafka_broker_topic = kafka_broker_topic || config["kafka_broker_topic"]
      if worker
        @worker = worker
        @worker.kafka_brokers_client = @kafka_brokers_client
        @worker.kafka_broker_topic = @kafka_broker_topic
      end
    end

    def post_event(event_name, payload, time = Time.now, ctx = {}, partition_key = nil)
      statsd_prefix = "live_events.events"
      tags = { event: event_name }

      ctx ||= {}
      attributes = ctx.except(*ATTRIBUTE_BLACKLIST).merge({
                                                            event_name:,
                                                            event_time: time.utc.iso8601(3)
                                                          })

      event = {
        attributes:,
        body: payload
      }

      # We don't care too much about the partition key, but it seems safe to
      # let it be the user_id when that's available.
      partition_key ||= ctx["user_id"]&.try(:to_s) || rand(1000).to_s

      pusher = @worker || LiveEvents.worker

      unless pusher.push(event, partition_key)
        LiveEvents.logger.error("Error queueing job for live event: #{event.to_json}")
        LiveEvents.statsd&.increment("#{statsd_prefix}.queue_full_errors", tags:)
      end
    end
  end
end
