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

      Rails.logger.info("----------------send_direct_message(zhjx_message_api.connection.rb)--------------------------")
      Rails.logger.info("user_name #{user_name}")
      Rails.logger.info("user_id #{user_id}")
      Rails.logger.info("message #{message}")
      Rails.logger.info("message.to_s #{message.to_s}")
      Rails.logger.info("================end send_direct_message(zhjx_message_api.connection.rb)==========================")
    end

  end
end
