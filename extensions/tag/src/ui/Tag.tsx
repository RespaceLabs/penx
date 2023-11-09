import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { TagElement } from '../types'

export const Tag = ({
  element,
  attributes,
  children,
}: ElementProps<TagElement>) => {
  let selected = useSelected()

  async function clickTag() {
    const database = await db.getDatabaseByName(element.name)
    console.log('db', database)
    if (database) {
      store.selectNode(database)
    }
  }

  return (
    <Box
      {...attributes}
      toCenterY
      inlineFlex
      bgGray100
      rounded
      overflowHidden
      ringBrand500={selected}
    >
      {children}
      <Box
        contentEditable={false}
        cursorPointer
        py1
        px1
        textSM
        onClick={clickTag}
      >
        # {element.name}
      </Box>
    </Box>
  )
}
