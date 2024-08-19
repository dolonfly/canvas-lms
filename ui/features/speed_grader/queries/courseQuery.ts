/*
 * Copyright (C) 2024 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {z} from 'zod'
import {executeQuery} from '@canvas/query/graphql'
import type {GradeStatus} from '@canvas/grading/accountGradingStatus'
import gql from 'graphql-tag'
import {omit} from 'lodash'

const QUERY = gql`
  query CourseData($courseId: ID!) {
    course(id: $courseId) {
      customGradeStatusesConnection {
        nodes {
          id: _id
          name
        }
      }
    }
  }
`

const defaultStandardStatusesMap: Record<string, Pick<GradeStatus, 'id' | 'name'>> = {
  late: {
    id: '-1',
    name: 'late',
  },
  missing: {
    id: '-2',
    name: 'missing',
  },
  excused: {
    id: '-5',
    name: 'excused',
  },
  extended: {
    id: '-6',
    name: 'extended',
  },
  none: {
    id: '-7',
    name: 'none',
  },
}

function transform(result: any) {
  const customGradeStatuses = result.course.customGradeStatusesConnection.nodes.map(
    (status: any) => {
      return omit(status, ['__typename'])
    }
  )

  return {
    gradeStatuses: [...Object.values(defaultStandardStatusesMap), ...customGradeStatuses],
  }
}

export const ZParams = z.object({
  courseId: z.string().min(1),
})

type Params = z.infer<typeof ZParams>

export async function getCourse<T extends Params>({
  queryKey,
}: {
  queryKey: [string, T]
}): Promise<any> {
  ZParams.parse(queryKey[1])
  const {courseId} = queryKey[1]

  const result = await executeQuery<any>(QUERY, {
    courseId,
  })

  return transform(result)
}
