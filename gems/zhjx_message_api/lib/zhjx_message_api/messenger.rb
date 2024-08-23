# frozen_string_literal: true

module ZhjxMessageApi
  class Messenger
    attr_reader :message
    attr_reader :id
    attr_reader :channel
    attr_reader :api_endpoint

    def initialize(api_endpoint, message, id, channel)
      @api_endpoint = api_endpoint
      @message = message
      @id = id
      @channel = channel
    end

    def deliver
      msg_api = ZhjxMessageApi::Connection.new(api_endpoint, channel)
      msg_api.send_direct_message("你好呀", to_id, message)
    end

    def to_id
      message.to
    end

  end
end
