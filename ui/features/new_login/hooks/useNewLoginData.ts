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

import {useEffect, useState} from 'react'
import type {AuthProvider} from '../types'

interface NewLoginData {
  enableCourseCatalog?: boolean
  authProviders?: AuthProvider[]
  loginHandleName?: string
  loginLogoUrl?: string
  loginLogoAlt?: string
  bodyBgColor?: string
  bodyBgImage?: string
  isPreviewMode?: boolean
}

const getLoginDataContainer = (): HTMLElement | null => document.getElementById('new_login_data')

const getStringAttribute = (container: HTMLElement, attribute: string): string | undefined =>
  container.getAttribute(attribute)?.trim() || undefined

const getBooleanAttribute = (container: HTMLElement, attribute: string): boolean | undefined => {
  const value = container.getAttribute(attribute)?.trim().toLowerCase()
  return value === 'true' ? true : value === 'false' ? false : undefined
}

const getObjectAttribute = <T>(container: HTMLElement, attribute: string): T | undefined => {
  const value = getStringAttribute(container, attribute)
  if (value) {
    try {
      return JSON.parse(value) as T
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Failed to parse ${attribute} as JSON:`, e)
    }
  }
  return undefined
}

export const useNewLoginData = (): NewLoginData => {
  const [newLoginData, setNewLoginData] = useState<NewLoginData>({
    enableCourseCatalog: undefined,
    authProviders: undefined,
    loginHandleName: undefined,
    loginLogoUrl: undefined,
    loginLogoAlt: undefined,
    bodyBgColor: undefined,
    bodyBgImage: undefined,
    isPreviewMode: undefined,
  })

  useEffect(() => {
    const container = getLoginDataContainer()
    if (container) {
      setNewLoginData({
        enableCourseCatalog: getBooleanAttribute(container, 'data-enable-course-catalog'),
        authProviders: getObjectAttribute<AuthProvider[]>(container, 'data-auth-providers'),
        loginHandleName: getStringAttribute(container, 'data-login-handle-name'),
        loginLogoUrl: getStringAttribute(container, 'data-login-logo-url'),
        loginLogoAlt: getStringAttribute(container, 'data-login-logo-alt'),
        bodyBgColor: getStringAttribute(container, 'data-body-bg-color'),
        bodyBgImage: getStringAttribute(container, 'data-body-bg-image'),
        isPreviewMode: getBooleanAttribute(container, 'data-is-preview-mode'),
      })
    }
  }, [])

  return newLoginData
}
