import { Box } from '@fower/react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { Input } from 'uikit'
import { DocEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useDoc } from '@penx/hooks'
import { insertEmptyParagraph } from '@penx/paragraph'
import { docToMarkdown } from '@penx/shared'

export function DocContent() {
  const { doc, docService } = useDoc()

  function handleEnterKeyInTitle(editor: Editor) {
    insertEmptyParagraph(editor, { at: [0] })

    ReactEditor.focus(editor as any)
    Transforms.select(editor, Editor.start(editor, [0]))
  }

  if (!doc.id) return null

  const { title } = doc
  const md = docToMarkdown(doc.raw)

  // return (
  //   <Box p10>
  //     <Textarea defaultValue={md} h-80vh />
  //   </Box>
  // )

  return (
    <Box relative>
      <Box mx-auto maxW-800>
        <DocEditor
          content={doc.content}
          onChange={(value, editor) => {
            if (isAstChange(editor)) {
              docService.updateDoc({
                content: JSON.stringify(value),
                title,
              })
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
                  docService.setTitleState(e.target.value)
                  docService.updateDoc({
                    title: e.target.value,
                    content: JSON.stringify(editor.children),
                  })
                }}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  )
}
