import { Box } from '@fower/react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { useDebouncedCallback } from 'use-debounce'
import { DocEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { usePage } from '@penx/hooks'
import { insertEmptyListItem } from '@penx/list'

export function NodeContent() {
  const { page, pageService } = usePage()

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    // console.log('value:', value)
    pageService.savePage(value[0], value[1])
  }, 500)

  function handleEnterKeyInTitle(editor: Editor) {
    insertEmptyListItem(editor, { at: [0, 0] })

    ReactEditor.focus(editor as any)
    Transforms.select(editor, Editor.start(editor, [0]))
  }

  if (!page || !page?.spaceId) return null

  console.log('page=====:', page)

  return (
    <Box relative>
      <Box mx-auto maxW-800>
        <DocEditor
          content={page.editorValue}
          onChange={(value, editor) => {
            if (isAstChange(editor)) {
              debouncedSaveNodes(value)
            }
          }}
        />
      </Box>
    </Box>
  )
}
