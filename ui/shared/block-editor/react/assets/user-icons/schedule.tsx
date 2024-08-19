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

import React from 'react'
import {SVGIcon} from '@instructure/ui-svg-images'
import {type IconProps} from './iconTypes'

import {useScope as useI18nScope} from '@canvas/i18n'

const I18n = useI18nScope('block-editor/user-icons')

export default ({elementRef, size = 'small'}: IconProps) => {
  return (
    <SVGIcon
      elementRef={elementRef}
      title={I18n.t('schedule')}
      src={`<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1214_13727)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.5878 5.14529H14.6582V4.74123C14.6582 4.29515 14.2901 3.93311 13.8366 3.93311C13.3831 3.93311 13.015 4.29515 13.015 4.74123V5.14529H8.08544V4.74123C8.08544 4.29515 7.71737 3.93311 7.26385 3.93311C6.81033 3.93311 6.44226 4.29515 6.44226 4.74123V5.14529H2.33429C1.88077 5.14529 1.5127 5.50733 1.5127 5.95342V22.1159C1.5127 22.562 1.88077 22.924 2.33429 22.924H25.3389C25.7924 22.924 26.1605 22.562 26.1605 22.1159V5.95342C26.1605 5.50733 25.7924 5.14529 25.3389 5.14529H21.2309V4.74123C21.2309 4.29515 20.8629 3.93311 20.4093 3.93311C19.9558 3.93311 19.5878 4.29515 19.5878 4.74123V5.14529ZM6.44226 6.76154H3.15588V21.3078H24.5173V6.76154H21.2309V7.56967C21.2309 8.01575 20.8629 8.37779 20.4093 8.37779C19.9558 8.37779 19.5878 8.01575 19.5878 7.56967V6.76154H14.6582V7.56967C14.6582 8.01575 14.2901 8.37779 13.8366 8.37779C13.3831 8.37779 13.015 8.01575 13.015 7.56967V6.76154H8.08544V7.56967C8.08544 8.01575 7.71737 8.37779 7.26385 8.37779C6.81033 8.37779 6.44226 8.01575 6.44226 7.56967V6.76154ZM5.62066 18.8834H8.90704C9.36056 18.8834 9.72863 18.5214 9.72863 18.0753C9.72863 17.6292 9.36056 17.2672 8.90704 17.2672H5.62066C5.16714 17.2672 4.79907 17.6292 4.79907 18.0753C4.79907 18.5214 5.16714 18.8834 5.62066 18.8834ZM12.1934 18.8834H15.4798C15.9333 18.8834 16.3014 18.5214 16.3014 18.0753C16.3014 17.6292 15.9333 17.2672 15.4798 17.2672H12.1934C11.7399 17.2672 11.3718 17.6292 11.3718 18.0753C11.3718 18.5214 11.7399 18.8834 12.1934 18.8834ZM18.7662 18.8834H22.0525C22.5061 18.8834 22.8741 18.5214 22.8741 18.0753C22.8741 17.6292 22.5061 17.2672 22.0525 17.2672H18.7662C18.3126 17.2672 17.9446 17.6292 17.9446 18.0753C17.9446 18.5214 18.3126 18.8834 18.7662 18.8834ZM5.62066 15.6509H8.90704C9.36056 15.6509 9.72863 15.2889 9.72863 14.8428C9.72863 14.3967 9.36056 14.0347 8.90704 14.0347H5.62066C5.16714 14.0347 4.79907 14.3967 4.79907 14.8428C4.79907 15.2889 5.16714 15.6509 5.62066 15.6509ZM12.1934 15.6509H15.4798C15.9333 15.6509 16.3014 15.2889 16.3014 14.8428C16.3014 14.3967 15.9333 14.0347 15.4798 14.0347H12.1934C11.7399 14.0347 11.3718 14.3967 11.3718 14.8428C11.3718 15.2889 11.7399 15.6509 12.1934 15.6509ZM18.7662 15.6509H22.0525C22.5061 15.6509 22.8741 15.2889 22.8741 14.8428C22.8741 14.3967 22.5061 14.0347 22.0525 14.0347H18.7662C18.3126 14.0347 17.9446 14.3967 17.9446 14.8428C17.9446 15.2889 18.3126 15.6509 18.7662 15.6509ZM5.62066 12.4184H8.90704C9.36056 12.4184 9.72863 12.0564 9.72863 11.6103C9.72863 11.1642 9.36056 10.8022 8.90704 10.8022H5.62066C5.16714 10.8022 4.79907 11.1642 4.79907 11.6103C4.79907 12.0564 5.16714 12.4184 5.62066 12.4184ZM12.1934 12.4184H15.4798C15.9333 12.4184 16.3014 12.0564 16.3014 11.6103C16.3014 11.1642 15.9333 10.8022 15.4798 10.8022H12.1934C11.7399 10.8022 11.3718 11.1642 11.3718 11.6103C11.3718 12.0564 11.7399 12.4184 12.1934 12.4184ZM18.7662 12.4184H22.0525C22.5061 12.4184 22.8741 12.0564 22.8741 11.6103C22.8741 11.1642 22.5061 10.8022 22.0525 10.8022H18.7662C18.3126 10.8022 17.9446 11.1642 17.9446 11.6103C17.9446 12.0564 18.3126 12.4184 18.7662 12.4184Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1214_13727">
<rect width="26.291" height="25.86" fill="white" transform="translate(0.691406 0.498535)"/>
</clipPath>
</defs>
</svg>`}
      size={size}
    />
  )
}
