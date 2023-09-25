import { memo, useState } from 'react'
import { Box } from '@fower/react'
import {
  Input,
  InputElement,
  InputGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'uikit'
import { CatalogueNode } from '@penx/catalogue'
import { useCatalogue, useDoc, useSpaces } from '@penx/hooks'

enum RenameType {
  Name,
  Pathname,
}

export const RenameCatalogueInput = memo(
  function RenameInput({
    node,
    setIsRenaming,
  }: {
    node: CatalogueNode
    setIsRenaming: (renaming: boolean) => void
  }) {
    const catalogue = useCatalogue()
    const [name, setName] = useState(node.name)
    const { setTitleState: setTitle } = useDoc()
    const [type, setType] = useState(RenameType.Name)

    async function updateName() {
      setIsRenaming(false)
      await catalogue.updateNodeName(node.id, name)

      if (node.isDoc) {
        setTitle(name)
      }
    }

    return (
      <Box mb-1>
        <InputGroup>
          <InputElement px1>
            <Select
              placement="bottom-start"
              value={type}
              onChange={(v: number) => setType(v)}
            >
              <SelectTrigger>
                <Box>N{type}</Box>
              </SelectTrigger>
              <SelectContent useTriggerWidth={false} w-200>
                <SelectItem value={RenameType.Name}>Name</SelectItem>
                <SelectItem value={RenameType.Pathname}>Pathname</SelectItem>
              </SelectContent>
            </Select>
          </InputElement>
          <Input
            size="sm"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateName()
              }
            }}
            onBlur={() => {
              updateName()
            }}
          />
        </InputGroup>
      </Box>
    )
  },
  (prev, next) => {
    if (prev.node.name !== next.node.name || prev.node.id !== next.node.id) {
      return true
    }
    return false
  },
)
