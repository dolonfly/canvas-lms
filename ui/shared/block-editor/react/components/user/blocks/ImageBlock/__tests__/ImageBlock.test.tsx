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
import {render} from '@testing-library/react'
import {Editor, Frame} from '@craftjs/core'
import {ImageBlock, type ImageBlockProps} from '..'

const renderBlock = (props: Partial<ImageBlockProps> = {}) => {
  return render(
    <Editor enabled={true} resolver={{ImageBlock}}>
      <Frame>
        <ImageBlock {...props} />
      </Frame>
    </Editor>
  )
}
describe('ImageBlock', () => {
  it('should render with default props', () => {
    const {container} = renderBlock()
    const block = container.querySelector('.image-block.empty')
    expect(block).toBeInTheDocument()
  })

  it('should render with src', () => {
    const {container} = renderBlock({src: 'https://example.com/image.jpg'})
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img?.getAttribute('src')).toBe('https://example.com/image.jpg')
  })

  it('should render with width and height', () => {
    const {container} = renderBlock({src: 'https://example.com/image.jpg', width: 101, height: 201})
    const img = container.querySelector('img')
    expect(img).toHaveStyle({width: '101px', height: '201px'})
  })

  it('should render with default cover constraint', () => {
    const {container} = renderBlock({src: 'https://example.com/image.jpg'})
    const img = container.querySelector('img')
    expect(img).toHaveStyle({objectFit: 'cover'})
  })

  it('should render with contain constraint', () => {
    const {container} = renderBlock({src: 'https://example.com/image.jpg', constraint: 'contain'})
    const img = container.querySelector('img')
    expect(img).toHaveStyle({objectFit: 'contain'})
  })
})
