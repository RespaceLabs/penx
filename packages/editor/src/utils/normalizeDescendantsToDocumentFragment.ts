import { Descendant, Editor, Element, Text } from 'slate'
import { ElementType } from '@penx/editor-shared'
import { isElement } from '@penx/editor-types'

const isInlineNode = (editor: Pick<Editor, 'isInline'>) => (node: Descendant) =>
  Text.isText(node) || editor.isInline(node)

const makeBlockLazy = (type: any) => (): Element => ({
  type,
  children: [],
})

const hasDifferentChildNodes = (
  descendants: Descendant[],
  isInline: (node: Descendant) => boolean,
): boolean => {
  return descendants.some((descendant, index, arr) => {
    const prevDescendant = arr[index - 1]
    if (index !== 0) {
      return isInline(descendant) !== isInline(prevDescendant)
    }
    return false
  })
}

/**
 * Handles 3rd constraint: "Block nodes can only contain other blocks, or inline and text nodes."
 */
const normalizeDifferentNodeTypes = (
  descendants: Descendant[],
  isInline: (node: Descendant) => boolean,
  makeDefaultBlock: () => Element,
): Descendant[] => {
  const hasDifferentNodes = hasDifferentChildNodes(descendants, isInline)

  const { fragment } = descendants.reduce(
    (memo, node) => {
      if (hasDifferentNodes && isInline(node)) {
        let block = memo.precedingBlock
        if (!block) {
          block = makeDefaultBlock()
          memo.precedingBlock = block
          memo.fragment.push(block)
        }
        block.children.push(node as any)
      } else {
        memo.fragment.push(node)
        memo.precedingBlock = null
      }

      return memo
    },
    {
      fragment: [] as Descendant[],
      precedingBlock: null as Element | null,
    },
  )

  return fragment
}

/**
 * Handles 1st constraint: "All Element nodes must contain at least one Text descendant."
 */
const normalizeEmptyChildren = (descendants: Descendant[]): Descendant[] => {
  if (!descendants.length) {
    return [{ text: '' }]
  }
  return descendants
}

const normalize = (
  descendants: Descendant[],
  isInline: (node: Descendant) => boolean,
  makeDefaultBlock: () => Element,
) => {
  descendants = normalizeEmptyChildren(descendants)
  descendants = normalizeDifferentNodeTypes(
    descendants,
    isInline,
    makeDefaultBlock,
  )

  descendants = descendants.map((node) => {
    if (isElement(node)) {
      return {
        ...node,
        children: normalize(node.children, isInline, makeDefaultBlock),
      }
    }
    return node
  }) as any

  return descendants
}

/**
 * Normalize the descendants to a valid document fragment.
 */
export const normalizeDescendantsToDocumentFragment = (
  editor: Editor,
  { descendants }: { descendants: Descendant[] },
) => {
  const isInline = isInlineNode(editor)
  const makeDefaultBlock = makeBlockLazy(ElementType.p)

  return normalize(descendants, isInline, makeDefaultBlock)
}
