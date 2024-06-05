//
// Copyright (C) 2024 - present Instructure, Inc.
//
// This file is part of Canvas.
//
// Canvas is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, version 3 of the License.
//
// Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import React, {useEffect, useRef} from 'react'
import $ from 'jquery'
import {CloseButton} from '@instructure/ui-buttons'
import {DrawerLayout} from '@instructure/ui-drawer-layout'
import {Flex} from '@instructure/ui-flex'
import {Heading} from '@instructure/ui-heading'
import {IconLtiLine} from '@instructure/ui-icons'
import {Img} from '@instructure/ui-img'
import {TruncateText} from '@instructure/ui-truncate-text'
import {View} from '@instructure/ui-view'
import {handleExternalContentMessages} from '@canvas/external-tools/messages'
import ToolLaunchIframe from '@canvas/external-tools/react/components/ToolLaunchIframe'
import type {Tool} from '@canvas/global/env/EnvCommon'

type Props = {
  tool: Tool | null
  pageContent: Element
  pageContentTitle: string
  pageContentMinWidth: string
  pageContentHeight: string
  trayPlacement: string
  onDismiss: any
  onResize: any
  onExternalContentReady?: any
  open: boolean
}

export default function ContentTypeExternalToolDrawer({
  tool,
  pageContent,
  pageContentTitle,
  pageContentMinWidth,
  pageContentHeight,
  trayPlacement,
  onDismiss,
  onResize,
  onExternalContentReady,
  open,
}: Props) {
  const queryParams = tool ? {display: 'borderless', placement: tool.placement} : {}
  const prefix = tool?.base_url.indexOf('?') === -1 ? '?' : '&'
  const iframeUrl = `${tool?.base_url}${prefix}${$.param(queryParams)}`
  const toolTitle = tool ? tool.title : 'External Tool'
  const toolIconUrl = tool?.icon_url
  const toolIconAlt = toolTitle ? `${toolTitle} Icon` : 'Tool Icon'
  const iframeRef = useRef()
  const pageContentRef = useRef()

  useEffect(
    // setup DrawerLayout content
    () => {
      // appends pageContent to DrawerLayout.content
      if (pageContentRef.current && pageContent) {
        pageContentRef.current.appendChild(pageContent)
      }
    },
    [pageContent]
  )

  useEffect(() => {
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  useEffect(
    // returns cleanup function:
    () => handleExternalContentMessages({ready: onExternalContentReady}),
    [onExternalContentReady]
  )

  return (
    <View display="block" height={pageContentHeight}>
      <DrawerLayout minWidth={pageContentMinWidth}>
        <DrawerLayout.Content label={pageContentTitle} id="drawer-layout-content">
          <div ref={pageContentRef} />
        </DrawerLayout.Content>
        <DrawerLayout.Tray
          label="Right Side Tray"
          open={open}
          placement={trayPlacement}
          onDismiss={onDismiss}
          data-testid="drawer-layout-tray"
          shouldCloseOnDocumentClick={false}
          themeOverride={{
            zIndex: '50',
          }}
        >
          <Flex
            height="1.5rem"
            justifyItems="space-between"
            alignItems="center"
            padding="medium small medium small"
            width="320px"
          >
            <Flex.Item padding="none small none none">
              {(toolIconUrl && <Img src={toolIconUrl} height="1rem" alt={toolIconAlt} />) || (
                <IconLtiLine />
              )}
            </Flex.Item>
            <Flex.Item shouldShrink={true} shouldGrow={true}>
              <Heading level="h4">
                <TruncateText>{toolTitle}</TruncateText>
              </Heading>
            </Flex.Item>
            <Flex.Item padding="none none none small">
              <CloseButton size="small" onClick={onDismiss} screenReaderLabel="Close" />
            </Flex.Item>
          </Flex>
          {tool && (
            <ToolLaunchIframe
              data-testid="ltiIframe"
              ref={iframeRef}
              src={iframeUrl}
              title={toolTitle}
            />
          )}
        </DrawerLayout.Tray>
      </DrawerLayout>
    </View>
  )
}
