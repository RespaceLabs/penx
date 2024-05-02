import { memo } from 'react'
import { styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { Node } from '@penx/model'

const CommandItem = styled(Command.Item)

interface Props {
  node: Node
  onSelect: (node: Node) => void
}

export const NodeItem = memo(
  function NodeItem({ node, onSelect }: Props) {
    return (
      <CommandItem
        cursorPointer
        toCenterY
        leadingSnug
        px3
        py2
        roundedLG
        value={node.id}
        onSelect={() => {
          onSelect(node)
        }}
        onClick={() => {
          onSelect(node)
        }}
      >
        {node.title || 'Untitled'}
      </CommandItem>
    )
  },
  (prev, next) => prev.node.title === next.node.title,
)
