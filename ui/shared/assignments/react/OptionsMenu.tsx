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
import {
  IconDownloadLine,
  IconUploadLine,
  IconUserLine,
  IconDuplicateLine,
  IconCommonsLine,
  IconEditLine,
  IconSpeedGraderLine,
  IconMoreLine,
  IconTrashLine,
} from '@instructure/ui-icons'
import {Menu} from '@instructure/ui-menu'
import {useScope as useI18nScope} from '@canvas/i18n'
import {BREAKPOINTS, type Breakpoints} from '@canvas/with-breakpoints'
import type {TeacherAssignmentType} from '../graphql/teacher/AssignmentTeacherTypes'
import {View} from '@instructure/ui-view'
import DirectShareUserModal from '@canvas/direct-sharing/react/components/DirectShareUserModal'
import DirectShareCourseTray from '@canvas/direct-sharing/react/components/DirectShareCourseTray'
import DownloadSubmissionsModal from '@canvas/download-submissions-modal'
import ItemAssignToTray from '@canvas/context-modules/differentiated-modules/react/Item/ItemAssignToTray'
import {useMutation} from '@apollo/react-hooks'
import {SET_WORKFLOW} from '@canvas/assignments/graphql/teacher/Mutations'
import {showFlashError} from '@canvas/alerts/react/FlashAlert'
import {ASSIGNMENT_VIEW_TYPES} from './AssignmentHeader'

const I18n = useI18nScope('assignment_more_button')

const OptionsMenu = ({
  type,
  assignment,
  breakpoints,
}: {
  type: string
  assignment: TeacherAssignmentType
  breakpoints: Breakpoints
}): React.ReactElement => {
  const [setWorkFlowState] = useMutation(SET_WORKFLOW)
  const [menuWidth, setMenuWidth] = useState(window.innerWidth)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [sendToModal, setSendToModalOpen, setSendToModalClose] = useBoolean(false)
  const [copyToTray, setCopyToTrayOpen, setCopyToTrayClose] = useBoolean(false)
  const [assignToTray, setAssignToTrayOpen, setAssignToTrayClose] = useBoolean(false)
  const [
    downloadSubmissionsModal,
    setDownloadSubmissionsModalOpen,
    setDownloadSubmissionsModalClose,
  ] = useBoolean(false)
  const peerReviewLink = `/courses/${assignment.course?.lid}/assignments/${assignment?.lid}/peer_reviews`
  const editLink = `/courses/${assignment.course?.lid}/assignments/${assignment?.lid}/edit`
  const speedgraderLink = `/courses/${assignment.course?.lid}/gradebook/speed_grader?assignment_id=${assignment?.lid}`
  const isSavedView = type === ASSIGNMENT_VIEW_TYPES.SAVED
  const isEditView = type === ASSIGNMENT_VIEW_TYPES.EDIT

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

  const handleDeletion = async () => {
    if (isEditView) {
      setWorkFlowState({variables: {id: Number(assignment.lid), workflow: 'deleted'}})
        .then(result => {
          if (result.errors?.length || !result.data || result.data.errors) {
            showFlashError(I18n.t('This assignment has failed to delete.'))()
          } else {
            window.location.assign(
              `/courses/${assignment.course?.lid}/assignments/${assignment?.lid}`
            )
          }
        })
        .catch(() => showFlashError(I18n.t('This assignment has failed to delete.'))())
    } else {
      window.location.assign(`/courses/${assignment.course?.lid}/assignments`)
    }
  }

  return (
    <>
      <Menu
        id="assignment_options_menu"
        label="assignment_options_menu"
        themeOverride={
          breakpoints.mobileOnly
            ? {minWidth: `${menuWidth}px`, maxWidth: BREAKPOINTS.mobileOnly.maxWidth}
            : {minWidth: isSavedView ? '250px' : '159px'}
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
              screenReaderLabel={I18n.t('Options')}
              data-testid="assignment-options-button"
              margin="none none none medium"
            />
          )
        }
      >
        {isSavedView && breakpoints.mobileOnly && (
          <Menu.Item value="Edit" href={editLink} data-testid="edit-option">
            <IconEditLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Edit')}</View>
          </Menu.Item>
        )}
        {isSavedView && breakpoints.mobileOnly && (
          <Menu.Item value="Assign To" onClick={setAssignToTrayOpen} data-testid="assign-to-option">
            <IconUserLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Assign To')}</View>
          </Menu.Item>
        )}
        {(breakpoints.mobileOnly || isEditView) && assignment.state === 'published' && (
          <Menu.Item
            value="SpeedGrader"
            href={speedgraderLink}
            target="_blank"
            data-testid="speedgrader-option"
          >
            <IconSpeedGraderLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('SpeedGrader')}</View>
          </Menu.Item>
        )}
        {isSavedView && assignment.hasSubmittedSubmissions && (
          <Menu.Item
            value="Download Submissions"
            onClick={setDownloadSubmissionsModalOpen}
            data-testid="download-submissions-option"
          >
            <IconDownloadLine />
            <View margin="0 0 0 x-small">{I18n.t('Download Submissions')}</View>
          </Menu.Item>
        )}
        {isSavedView && assignment.submissionsDownloads && assignment.submissionsDownloads > 0 && (
          <Menu.Item value="Re-Upload Submissions" data-testid="reupload-submissions-option">
            <IconUploadLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Re-Upload Submissions')}</View>
          </Menu.Item>
        )}
        {isSavedView && assignment.peerReviews?.enabled && (
          <Menu.Item value="Peer Review" href={peerReviewLink} data-testid="peer-review-option">
            <IconUserLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Peer Review')}</View>
          </Menu.Item>
        )}
        {isSavedView && (
          <Menu.Item value="Send To" onClick={setSendToModalOpen} data-testid="send-to-option">
            <IconUserLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Send To')}</View>
          </Menu.Item>
        )}
        {isSavedView && (
          <Menu.Item value="Copy To" onClick={setCopyToTrayOpen} data-testid="copy-to-option">
            <IconDuplicateLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Copy To')}</View>
          </Menu.Item>
        )}
        {isSavedView && (
          <Menu.Item value="Share to Commons" data-testid="share-to-commons-option">
            <IconCommonsLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Share to Commons')}</View>
          </Menu.Item>
        )}
        {!isSavedView && (
          <Menu.Item value="Delete" onClick={handleDeletion} data-testid="delete-assignment-option">
            <IconTrashLine size="x-small" />
            <View margin="0 0 0 x-small">{I18n.t('Delete')}</View>
          </Menu.Item>
        )}
      </Menu>

      {isSavedView && (
        <View margin="0">
          <ItemAssignToTray
            open={assignToTray}
            onClose={setAssignToTrayClose}
            onDismiss={setAssignToTrayClose}
            itemType="assignment"
            iconType="assignment"
            locale={ENV.LOCALE || 'env'}
            timezone={ENV.TIMEZONE || 'UTC'}
            courseId={assignment.course?.lid}
            itemName={assignment.name}
            itemContentId={assignment?.lid}
            pointsPossible={assignment.pointsPossible as number}
          />
          <DirectShareCourseTray
            data-testid="copy-to-tray"
            open={copyToTray}
            sourceCourseId={assignment.course?.lid}
            contentSelection={{assignments: [assignment?.lid]}}
            onDismiss={() => {
              setCopyToTrayClose()
              buttonRef.current?.focus()
            }}
          />
          <DirectShareUserModal
            data-testid="send-to-modal"
            open={sendToModal}
            sourceCourseId={assignment.course?.lid}
            contentShare={{content_type: 'assignment', content_id: assignment?.lid}}
            onDismiss={() => {
              setSendToModalClose()
              buttonRef.current?.focus()
            }}
          />
          <DownloadSubmissionsModal
            open={downloadSubmissionsModal}
            handleCloseModal={setDownloadSubmissionsModalClose}
            assignmentId={assignment.lid}
            courseId={assignment.course.lid}
          />
        </View>
      )}
    </>
  )
}

export default OptionsMenu
