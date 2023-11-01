import { useMemo } from 'react'
import {
  Item,
  ItemParams,
  Menu,
  Separator,
  Submenu,
  useContextMenu,
} from 'react-contexify'
import { Box } from '@fower/react'
import { TElement, useEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { ListContentElement } from '../types'
import { Bullet } from './Bullet'
import { Chevron } from './Chevron'

const MENU_ID = 'menu-id'

export const ListItemContent = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListContentElement>) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!
  const child = getNodeByPath(editor, [...path, 0]) as TElement
  const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child.type)

  function h() {
    return isHeading ? 'calc(1.8em + 8px)' : 'calc(1.5em + 8px)'
  }

  const memoedChildren = useMemo(
    () => (
      <Box flex-1 pl1 leadingNormal>
        {children}
      </Box>
    ),
    [children],
  )
  const { show } = useContextMenu({
    id: MENU_ID,
  })

  function handleItemClick({ event, props, triggerEvent, data }: ItemParams) {
    console.log(event, props, triggerEvent, data)
  }

  function displayMenu(e: any) {
    show({ event: e })
  }

  return (
    <Box
      {...attributes}
      data-type="list-item-content"
      m0
      leadingNormal
      textBase
      relative
      toTop
      p1
      gap2
      {...nodeProps}
      className="nodeContent"
    >
      <Menu id={MENU_ID} contentEditable={false}>
        <Item onClick={handleItemClick}>Add to favorite</Item>
        <Item onClick={handleItemClick}>Publish</Item>
        <Separator />
        <Item onClick={handleItemClick}>Copy</Item>
        <Item onClick={handleItemClick}>Delete</Item>
        <Submenu label="Move to">
          <Item onClick={handleItemClick}>Sub Item 1</Item>
          <Item onClick={handleItemClick}>Sub Item 1</Item>
          <Item onClick={handleItemClick}>Sub Item 2</Item>
        </Submenu>
        <Separator />
        <Item onClick={handleItemClick}>Expand all</Item>
        <Item onClick={handleItemClick}>Collapse all</Item>
      </Menu>

      <Box
        absolute
        top-2
        w-40
        left--40
        contentEditable={false}
        toCenterY
        toRight
        flexShrink-1
        gap-2
        leadingNormal
        h={h()}
        textSM
        text3XL={child.type === 'h1'}
        text2XL={child.type === 'h2'}
        textXL={child.type === 'h3'}
        textLG={child.type === 'h4'}
      >
        <Chevron element={element} displayMenu={displayMenu} />
        <Bullet element={element} displayMenu={displayMenu} />
      </Box>
      {memoedChildren}
    </Box>
  )
}
