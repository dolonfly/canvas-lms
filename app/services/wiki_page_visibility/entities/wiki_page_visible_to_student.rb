# frozen_string_literal: true

#
# Copyright (C) 2024 - present Instructure, Inc.
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

module WikiPageVisibility
  module Entities
    # When a wiki page is visible to a (student) user
    class WikiPageVisibleToStudent
      attr_reader :course_id,
                  :user_id,
                  :wiki_page_id

      def initialize(course_id:,
                     user_id:,
                     wiki_page_id:)
        raise ArgumentError, "course_id cannot be nil" if course_id.nil?
        raise ArgumentError, "user_id cannot be nil" if user_id.nil?
        raise ArgumentError, "wiki_page_id cannot be nil" if wiki_page_id.nil?

        @course_id = course_id
        @user_id = user_id
        @wiki_page_id = wiki_page_id
      end

      # two WikiPageVisibleToStudent DTOs are equal if all of their attributes are equal
      def ==(other)
        return false unless other.is_a?(WikiPageVisibleToStudent)

        course_id == other.course_id &&
          user_id == other.user_id &&
          wiki_page_id == other.wiki_page_id
      end

      def eql?(other)
        self == other
      end

      def hash
        [course_id, user_id, wiki_page_id].hash
      end
    end
  end
end
