import { useRef } from 'react'
import { createEditor, Editor, Element, Point, Range, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { withListsReact } from 'slate-lists'
import { withReact } from 'slate-react'
import { withAutoformat } from '@penx/autoformat'
import {
  getCurrentNode,
  getPreviousBlockById,
  isCollapsed,
} from '@penx/editor-queries'
import { useExtensionStore } from '@penx/hooks'
import {
  getEmptyParagraph,
  isParagraph,
  ParagraphElement,
} from '@penx/paragraph'
import { isTable } from '@penx/table'

export function useCreateEditor() {
  const { extensionStore } = useExtensionStore()
  const editorRef = useRef<Editor>()
  const { rules, inlineTypes, voidTypes, elementMaps, onKeyDownFns } =
    extensionStore

  const withFns: ((editor: Editor) => any)[] = [
    withHistory,
    withReact,
    withListsReact as any,
    ...extensionStore.withFns,
  ]

  /**
   * handle isInline and isVoid
   * TODO: handle
   */
  withFns.push((editor) => {
    const { isInline, deleteBackward } = editor
    editor.isInline = (element: any) => {
      return inlineTypes.includes(element.type) ? true : isInline(element)
    }

    editor.isVoid = (element: any) => {
      return voidTypes.includes(element.type) ? true : isInline(element)
    }

    // handle deleteBackward
    editor.deleteBackward = (...args) => {
      const { selection } = editor

      if (!isCollapsed(selection)) return deleteBackward(...args)

      if (selection && Range.isCollapsed(selection)) {
        const match = Editor.above(editor, {
          match: (n) => Editor.isBlock(editor, n as Element),
        })

        if (match) {
          const [block, path] = match as any
          const start = Editor.start(editor, path)

          const isStartOfBlock =
            !Editor.isEditor(block) &&
            Element.isElement(block) &&
            Point.equals(selection.anchor, start)

          const isGeneral = ['p', 'lic', 'code_line'].includes(block.type)

          if (isStartOfBlock) {
            const { id } = getCurrentNode(editor)! as any

            // for first line block
            if (
              isParagraph(block) &&
              editor.children.length > 1 &&
              editor.children[0] === block
            ) {
              Transforms.removeNodes(editor, { at: path })
              return
            }

            if (isGeneral) {
              const nodeEntry = getPreviousBlockById(editor, id!)!

              if (!nodeEntry) {
                deleteBackward(...args) // TODO:
                return
              }

              const [prevNode, prevPath] = nodeEntry

              if (isTable(prevNode)) {
                Transforms.select(editor, Editor.end(editor, prevPath))
                return
              }
            } else {
              Transforms.setNodes(editor, getEmptyParagraph())
              return
            }
          }
        }

        deleteBackward(...args)
      }
    }
    ;(editor as any).elementMaps = elementMaps
    ;(editor as any).onKeyDownFns = onKeyDownFns

    return editor
  })

  if (!editorRef.current) {
    const editor = withFns.reduce<any>(
      (wrappedEditor, plugin) => plugin(wrappedEditor),
      createEditor(),
    )

    // handle autoformat
    editorRef.current = withAutoformat(editor, {
      key: 'AUTO_FORMAT',
      options: {
        rules,
        shouldIgnore(editor: Editor) {
          // TODO: should improve
          const match = Editor.above(editor, {
            match: (n: any) => ['code_block'].includes(n.type),
          })

          if (match?.[0]) return true
          return false
        },
      },
    } as any)
  }

  /**
   * TODO: for debug
   */
  if (typeof window !== 'undefined') {
    ;(window as any).__editor = editorRef.current
  }

  // if (editorRef.current) storeEditor(editorRef.current)

  return editorRef.current!
}
