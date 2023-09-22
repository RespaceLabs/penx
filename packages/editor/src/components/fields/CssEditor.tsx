import { FC, forwardRef } from 'react'
import { Box, css } from '@fower/react'
import { Editor, Node, Point, Transforms } from 'slate'
import { Editable, Slate } from 'slate-react'
import { isCollapsed } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { useCreateEditor } from '../../hooks/useCreateEditor'

function insertNewAtomic(editor: Editor) {
  Transforms.insertNodes(
    editor,
    {
      type: ElementType.atomic_props,
      children: [{ text: '' }],
    },
    // { at: Editor.end(editor, []) },
  )
}

interface Props {
  label: string
  value: any
  onChange: () => any
}

const defaultValue = [
  {
    type: ElementType.atomic_props_input,
    children: [{ text: '' }],
  },
]

export const CssEditor = forwardRef<HTMLDivElement, Props>(function CssEditor(
  { label, value = defaultValue, onChange },
  ref,
) {
  const editor = useCreateEditor([
    {
      with: (editor) => {
        const { insertText, isInline, deleteBackward } = editor
        editor.insertText = (text) => {
          if (!editor.selection || !isCollapsed(editor.selection)) return
          const { path } = editor.selection.focus
          const node = Node.get(editor, path.slice(0, -1))

          if (text === ' ') {
            if (node.type === ElementType.atomic_props_input) {
              Transforms.setNodes(editor, { type: ElementType.atomic_props })
              return
            } else if (node.type === ElementType.atomic_props) {
              // if is empty text, do not insert
              if (Node.string(node) === '') return
              insertNewAtomic(editor)
              return
            }
          } else {
            if (node.type === ElementType.atomic_props_input) {
              Transforms.setNodes(editor, { type: ElementType.atomic_props })
            }
          }
          insertText(text)
        }

        editor.insertBreak = () => {
          const end = Editor.end(editor, [])

          if (!editor.selection || !isCollapsed(editor.selection)) return

          const { path } = editor.selection.focus
          // const node = Node.get(editor, path.slice(0, -1))

          if (Point.equals(end, editor.selection?.focus)) {
            insertNewAtomic(editor)
          }

          return
        }

        editor.deleteBackward = (unit) => {
          // handle last atomic props
          if (editor.children.length === 1) {
            if (editor.selection && isCollapsed(editor.selection)) {
              const { path } = editor.selection.focus
              const node = Node.get(editor, path.slice(0, -1))
              if (
                node.type === ElementType.atomic_props &&
                Node.string(node) === ''
              ) {
                Transforms.setNodes(editor, {
                  type: ElementType.atomic_props_input,
                })
                return
              }
            }
          }
          deleteBackward(unit)
        }

        return editor
      },
    },
  ])
  return (
    <Box ref={ref} mb4>
      {label && <Box>{label}</Box>}
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <Editable
          onBlur={(e) => {
            // for good experience, insert a text at the end
            const node = editor.children[editor.children.length - 1]
            if (node.type !== ElementType.atomic_props_input) {
              Transforms.insertNodes(
                editor,
                {
                  type: ElementType.atomic_props_input,
                  children: [{ text: '' }],
                },
                { at: Editor.end(editor, []) },
              )
            }
          }}
          className={css('spaceX1 border p2 rounded')}
          renderElement={({ element, children, attributes }) => {
            if (element.type === ElementType.atomic_props) {
              return (
                <Box bgGray100 py1 px2 my1 rounded inlineBlock {...attributes}>
                  {children}
                </Box>
              )
            }
            return (
              <Box inlineBlock minW-1 {...attributes}>
                {children}
              </Box>
            )
          }}
        />
      </Slate>
    </Box>
  )
})
