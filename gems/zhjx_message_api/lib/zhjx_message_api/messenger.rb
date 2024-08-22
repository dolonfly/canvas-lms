# frozen_string_literal: true

module ZhjxMessageApi
  class Messenger
    attr_reader :message
    attr_reader :id
    attr_reader :channel

    def initialize(message, id,channel)
      @message = message
      @id = id
      @channel = channel
    end

    def deliver
      msg_api = ZhjxMessageApi::Connection.new(channel)
      msg_api.send_direct_message("你好呀", to_id, message)
    end

    def to_id
      message.to
    end

  end
end
