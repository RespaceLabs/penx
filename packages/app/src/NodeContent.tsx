import { Box } from '@fower/react'
import { Descendant, Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from 'uikit'
import { DocEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { usePage } from '@penx/hooks'
import { insertEmptyListItem } from '@penx/list'

export function NodeContent() {
  const { page, pageService } = usePage()

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    const listItems = value[0].children
    pageService.saveNodes(listItems)
  }, 500)

  function handleEnterKeyInTitle(editor: Editor) {
    insertEmptyListItem(editor, { at: [0, 0] })

    ReactEditor.focus(editor as any)
    Transforms.select(editor, Editor.start(editor, [0]))
  }

  if (!page || !page?.spaceId) return null

  console.log('page-------:', page)

  const { title } = page

  return (
    <Box relative>
      <Box mx-auto maxW-800>
        <DocEditor
          content={page.editorValue}
          onChange={(value, editor) => {
            if (isAstChange(editor)) {
              console.log('value:', value)
              debouncedSaveNodes(value)
            }
          }}
          renderPrefix={(editor) => (
            <Box>
              <Input
                text5XL
                fontSemibold
                h-2em
                placeholderGray300
                autoFocus
                leadingNormal
                value={title || ''}
                variant="unstyled"
                placeholder="Untitled"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleEnterKeyInTitle(editor)
                  }
                }}
                onChange={(e) => {
                  // docService.setTitleState(e.target.value)
                  // docService.updateDoc({
                  //   title: e.target.value,
                  //   content: JSON.stringify(editor.children),
                  // })
                }}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  )
}
