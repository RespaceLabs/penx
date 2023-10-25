import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Transforms } from 'slate'
import { ReactEditor, useSelected, useSlate, useSlateStatic } from 'slate-react'
import {
  Menu,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from 'uikit'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { TableElement } from '../../types'

export const TableOptions = ({ element }: { element: TableElement }) => {
  const editor = useEditorStatic()
  const selected = useSelected()
  const { isHeaderColumn = false, isHeaderRow = false } = element
  const path = ReactEditor.findPath(editor, element)
  function removeTable() {
    const tablePath = findNodePath(editor, element)
    Transforms.removeNodes(editor, { at: tablePath })
  }

  if (!selected) return null
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Box
          contentEditable={false}
          absolute
          bgWhite
          right0
          top--42
          toCenter
          h-32
          w-32
          rounded
          cursorPointer
          transitionAll
          shadow="0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)"
        >
          <MoreHorizontal />
        </Box>
      </PopoverTrigger>
      <PopoverContent w-240>
        <MenuItem onClick={() => removeTable()}>Delete</MenuItem>
        <MenuItem>
          <Switch
            size="sm"
            rowReverse
            flex-1
            toBetween
            checked={isHeaderColumn}
            onChange={(e) => {
              Transforms.setNodes<TableElement>(
                editor,
                { isHeaderColumn: e.target.checked },
                { at: path },
              )
            }}
          >
            Header column
          </Switch>
        </MenuItem>

        <MenuItem>
          <Switch
            size="sm"
            rowReverse
            flex-1
            toBetween
            checked={isHeaderRow}
            onChange={(e) => {
              Transforms.setNodes<TableElement>(
                editor,
                { isHeaderRow: e.target.checked },
                { at: path },
              )
            }}
          >
            Header row
          </Switch>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}
