import { styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useCatalogue } from '@penx/hooks'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  close: () => void
}

export function DocList({ q, close }: Props) {
  const catalogue = useCatalogue()
  const filteredItems = catalogue.docNodes.filter((i) =>
    i.name.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <>
      {!filteredItems.length && (
        <Command.Empty>No results found.</Command.Empty>
      )}

      {filteredItems.map((node) => (
        <CommandItem
          key={node.id}
          h10
          cursorPointer
          toCenterY
          px2
          transitionCommon
          roundedLG
          value={node.id}
          onSelect={() => {
            close()
            catalogue.selectNode(node)
          }}
          onClick={() => {
            catalogue.selectNode(node)
          }}
        >
          {node.name}
        </CommandItem>
      ))}
    </>
  )
}
