# frozen_string_literal: true
require "faraday/follow_redirects"
require "faraday/multipart"

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
      Rails.logger.info("message.to_json #{message.to_json}")
      Rails.logger.info("================end send_direct_message(zhjx_message_api.connection.rb)==========================")

      reqBody = {
        type: '课程通知',
        title: '课程平台通知' + message.subject,
        templateCode: 'canvas',
        senderId: 'admin',
        senderName: '课程平台',
        receiveObjs: [
          {
            receiverId: '1234',
            sourceCode: 'canvas',
            sourceParams: '',
            variables: {
              body: message.body,
              url: 'https://lms.zut.edu.cn'
            }
          }
        ]
      }

      make_call reqBody
    end


    def connection
      @connection ||= Faraday.new do |conn|
        conn.request :json
        conn.request :url_encoded
        conn.response :json, preserve_raw: true
        conn.response :follow_redirects
        conn.adapter :net_http
      end
    end

    def make_call(body)
      response = connection.post('http://222.22.91.70:8041/api/send') do |req|
        req.headers['Content-Type'] = 'application/json'
        req.body = body.to_json
      end
      Rails.logger.info("#{response.to_json}")
    end

  end
end
