import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath } from '@/lib/editor-queries'

import { MoreHorizontal } from 'lucide-react'
import { Transforms } from 'slate'
import { ReactEditor, useSelected, useSlate, useSlateStatic } from 'slate-react'
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
    <Popover>
      <PopoverTrigger>
        <div
          contentEditable={false}
          className="absolute bg-background right-0 -top-10 flex items-center justify-center h-8 w-8 rounded cursor-pointer transition-all"
          style={{
            boxShadow:
              '0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)',
          }}
        >
          <MoreHorizontal />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div onClick={() => removeTable()}>Delete</div>
        <div>
          <Switch
            checked={isHeaderColumn}
            onChange={(e) => {
              Transforms.setNodes<TableElement>(
                editor,
                {
                  // isHeaderColumn: e.target.checked,
                },
                { at: path },
              )
            }}
          >
            Header column
          </Switch>
        </div>

        <div>
          <Switch
            checked={isHeaderRow}
            onChange={(e) => {
              Transforms.setNodes<TableElement>(
                editor,
                {
                  // isHeaderRow: e.target.checked,
                },
                { at: path },
              )
            }}
          >
            Header row
          </Switch>
        </div>
      </PopoverContent>
    </Popover>
  )
}
