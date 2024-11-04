import { useRef, useState } from 'react'
import { createEditor, Editor, Element, Point, Range, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { withAutoformat } from '@/lib/autoformat'
import { ELEMENT_CODE_LINE, ELEMENT_LIC, ELEMENT_P } from '@/lib/constants'
import { PenxEditor, TElement } from '@/lib/editor-common'
import {
  getCurrentNode,
  getPreviousBlockById,
  isCollapsed,
} from '@/lib/editor-queries'
import { extensionStore } from '@/lib/extension-store'
import { getEmptyParagraph, isParagraph } from '@/editor-extensions/paragraph'
import { withListsReact } from '@/lib/slate-lists'
import { isTable } from '@/editor-extensions/table'

type WithFns = (editor: PenxEditor) => PenxEditor

export function useCreateEditor(fns: WithFns[] = []) {
  const editorRef = useRef<PenxEditor>()
  const {
    rules,
    inlineTypes,
    voidTypes,
    elementMaps,
    onKeyDownFns,
    onBlurFns,
    onSelectFns,
  } = extensionStore

  const withFns: ((editor: PenxEditor) => any)[] = [
    withHistory,
    withReact,
    withListsReact as any,
    ...fns,
    ...extensionStore.withFns,
  ]

  /**
   * handle isInline and isVoid
   * TODO: handle
   */
  withFns.push((editor) => {
    const { isInline, isVoid, deleteBackward } = editor
    editor.isInline = (element: any) => {
      return inlineTypes.includes(element.type) ? true : isInline(element)
    }

    editor.isVoid = (element: any) => {
      return voidTypes.includes(element.type) ? true : isVoid(element)
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

          const isGeneral = [
            ELEMENT_P,
            ELEMENT_LIC,
            ELEMENT_CODE_LINE,
          ].includes(block.type)

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
    editor.elementMaps = elementMaps
    editor.onKeyDownFns = onKeyDownFns
    editor.onBlurFns = onBlurFns
    editor.onSelectFns = onSelectFns

    return editor
  })

  if (!editorRef.current) {
    editorRef.current = withFns.reduce<any>(
      (wrappedEditor, plugin) => plugin(wrappedEditor),
      createEditor(),
    )
  }

  // handle autoformat
  editorRef.current = withAutoformat(
    editorRef.current as any,
    {
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
    } as any,
  ) as any

  /**
   * TODO: for debug
   */
  if (typeof window !== 'undefined') {
    ;(window as any).__editor = editorRef.current
  }

  return editorRef.current as PenxEditor
}
