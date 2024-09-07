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

import React, {useState, useEffect, useRef} from 'react'
import useBoolean from '@canvas/outcomes/react/hooks/useBoolean'
import {IconButton, Button} from '@instructure/ui-buttons'
import {Flex} from '@instructure/ui-flex'
import {
  IconDownloadLine,
  IconUploadLine,
  IconUserLine,
  IconDuplicateLine,
  IconCommonsLine,
  IconEditLine,
  IconSpeedGraderLine,
  IconMoreLine,
} from '@instructure/ui-icons'
import {Menu} from '@instructure/ui-menu'
import {useScope as useI18nScope} from '@canvas/i18n'
import {BREAKPOINTS, type Breakpoints} from '@canvas/with-breakpoints'
import type {TeacherAssignmentType} from '../../graphql/AssignmentTeacherTypes'
import {View} from '@instructure/ui-view'

const I18n = useI18nScope('assignment_more_button')

const OptionsMenu = ({
  assignment,
  breakpoints,
}: {
  assignment: TeacherAssignmentType
  breakpoints: Breakpoints
}): React.ReactElement => {
  const [menuOpen, setMenuOpen, setMenuClose] = useBoolean(false)
  const [menuWidth, setMenuWidth] = useState(window.innerWidth)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const updateMenuWidth = () => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth)
    }
  }

  useEffect(() => {
    const handleResize = () => updateMenuWidth()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const buttonRefCallback = (element: HTMLButtonElement | null) => {
    buttonRef.current = element
    updateMenuWidth()
  }

  const handleMenuToggle = (show: boolean, _menu: Menu): void => {
    if (show && setMenuOpen instanceof Function) {
      setMenuOpen()
    } else if (!show && setMenuClose instanceof Function) {
      setMenuClose()
    }
  }

  return (
    <Menu
      id="assignment_options_menu"
      label="assignment_options_menu"
      onToggle={handleMenuToggle}
      themeOverride={
        breakpoints.mobileOnly
          ? {minWidth: `${menuWidth}px`, maxWidth: BREAKPOINTS.mobileOnly.maxWidth}
          : {minWidth: '250px'}
      }
      withArrow={false}
      placement={breakpoints.mobileOnly ? 'bottom center' : 'bottom end'}
      trigger={
        breakpoints.mobileOnly ? (
          <Button
            elementRef={buttonRefCallback}
            data-testid="assignment-options-button"
            display="block"
          >
            {I18n.t('More')}
          </Button>
        ) : (
          <IconButton
            renderIcon={IconMoreLine}
            screenReaderLabel={I18n.t('Dashboard Options')}
            data-testid="assignment-options-button"
            margin="none none none medium"
          />
        )
      }
    >
      {breakpoints.mobileOnly && (
        <Menu.Item value="Edit" data-testid="edit-option">
          <Flex>
            <View margin="0 x-small 0 0">
              <IconEditLine />
            </View>
            {I18n.t('Edit')}
          </Flex>
        </Menu.Item>
      )}
      {breakpoints.mobileOnly && (
        <Menu.Item value="Assign To" data-testid="assign-to-option">
          <Flex>
            <View margin="0 x-small 0 0">
              <IconUserLine />
            </View>
            {I18n.t('Assign To')}
          </Flex>
        </Menu.Item>
      )}
      {breakpoints.mobileOnly && assignment.state === 'published' && (
        <Menu.Item value="SpeedGrader" data-testid="speedgrader-option">
          <Flex>
            <View margin="0 x-small 0 0">
              <IconSpeedGraderLine />
            </View>
            {I18n.t('SpeedGrader')}
          </Flex>
        </Menu.Item>
      )}
      {assignment.hasSubmittedSubmissions && (
        <Menu.Item value="Download Submissions" data-testid="download-submissions-option">
          <Flex>
            <View margin="0 x-small 0 0">
              <IconDownloadLine />
            </View>
            {I18n.t('Download Submissions')}
          </Flex>
        </Menu.Item>
      )}
      {assignment.submissionsDownloads > 0 && (
        <Menu.Item value="Re-Upload Submissions" data-testid="reupload-submissions-option">
          <Flex>
            <View margin="0 x-small 0 0">
              <IconUploadLine />
            </View>
            {I18n.t('Re-Upload Submissions')}
          </Flex>
        </Menu.Item>
      )}
      {assignment.peerReviews.enabled && (
        <Menu.Item value="Peer Review" data-testid="peer-review-option">
          <Flex>
            <View margin="0 x-small 0 0">
              <IconUserLine />
            </View>
            {I18n.t('Peer Review')}
          </Flex>
        </Menu.Item>
      )}
      <Menu.Item value="Send To" data-testid="send-to-option">
        <Flex>
          <View margin="0 x-small 0 0">
            <IconUserLine />
          </View>
          {I18n.t('Send To')}
        </Flex>
      </Menu.Item>
      <Menu.Item value="Copy To" data-testid="copy-to-option">
        <Flex>
          <View margin="0 x-small 0 0">
            <IconDuplicateLine />
          </View>
          {I18n.t('Copy To')}
        </Flex>
      </Menu.Item>
      <Menu.Item value="Share to Commons" data-testid="share-to-commons-option">
        <Flex>
          <View margin="0 x-small 0 0">
            <IconCommonsLine />
          </View>
          {I18n.t('Share to Commons')}
        </Flex>
      </Menu.Item>
    </Menu>
  )
}

export default OptionsMenu
