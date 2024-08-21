# frozen_string_literal: true

module ZhjxMessageApi
  class Connection
    attr_reader :channel

    TYPE_MESSAGE_CHANNEL_Portal = "portal"
    TYPE_MESSAGE_CHANNEL_WeCom = "wecom" # 企业微信

    VALID_MESSAGE_CHANNEL = [TYPE_MESSAGE_CHANNEL_Portal, TYPE_MESSAGE_CHANNEL_WeCom].freeze

    def self.from_channel(msg_channel)
      channel = TYPE_MESSAGE_CHANNEL_Portal unless VALID_MESSAGE_CHANNEL.include?(msg_channel)
      ZhjxMessageApi::Connection.new(channel)
    end

    def initialize(channel)
      @channel = channel
    end

    # public (to gem)
    def send_direct_message(user_name, user_id, message)

      logger.info("----------------send_direct_message(zhjx_message_api.connection.rb)--------------------------")
      logger.info("user_name #{user_name}")
      logger.info("user_id #{user_id}")
      logger.info("message #{message}")
      logger.info("message.to_s #{message.to_s}")
      logger.info("================end send_direct_message(zhjx_message_api.connection.rb)==========================")
    end

    def self.logger
      (@logger.respond_to?(:call) ? @logger.call : @logger) || default_logger
    end

    def self.default_logger
      @_default_logger ||= Logger.new($stdout)
    end
  end
end
