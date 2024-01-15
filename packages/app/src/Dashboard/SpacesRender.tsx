import { useContext, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { KeyRound } from 'lucide-react'
import { Bullet } from 'uikit'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { SpacesContext } from '.'

interface Props {
  spaces: ISpace[]
}

export function SpacesRender({ spaces }: Props) {
  const [activeSpace, setActiveSpace] = useState<ISpace>()
  const { setSpaceNodes } = useContext(SpacesContext)

  const onSpaceItem = async (item: ISpace) => {
    setActiveSpace(item)
    const newNodes = await db.listNodesBySpaceId(item.id)
    setSpaceNodes(newNodes)
  }

  useEffect(() => {
    spaces.length && setActiveSpace(spaces[0])
  }, [spaces])

  return (
    <Box>
      {spaces?.map((item) => (
        <Box
          key={item.id}
          bgGray100={activeSpace?.id === item.id}
          bgGray100--hover
          toCenterY
          toBetween
          py3
          px3
          gapX2
          textBase
          roundedLG
          cursorPointer
          transitionColors
          onClick={() => onSpaceItem(item)}
        >
          <Box toCenterY gap2>
            <Bullet size={20} innerSize={6} innerColor={item.color} />
            <Box>{item.name}</Box>
          </Box>
          <Box toCenterY gap1 gray600>
            {item.encrypted && <KeyRound size={16} />}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
