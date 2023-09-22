import { FC, memo } from 'react'
import { Box } from '@fower/react'
import { Path } from 'slate'
import { ElementType } from '@penx/editor-shared'
import { isEqual } from '../../common/utils'
import { DragMenu } from './DragMenu'

interface Props {
  id: string
  type: ElementType
  path: Path
  listeners: any
}

export const ElementMenu: FC<Props> = memo(
  function ElementMenu({ id = '', type, path, listeners }) {
    const width = 80
    const isHeading = [
      ElementType.h1,
      ElementType.h2,
      ElementType.h3,
      ElementType.h4,
    ].includes(type)
    return (
      <Box
        contentEditable={false}
        toCenterY
        toRight
        absolute
        left={-width - 6}
        w={width}
        h={isHeading ? '2em' : 'calc(1.5em + 8px)'}
        textBase
        text3XL={type === ElementType.h1}
        text2XL={type === ElementType.h2}
        textXL={type === ElementType.h3}
        textLG={type === ElementType.h4}
        textSM={type === ElementType.h6}
      >
        <DragMenu id={id} type={type} path={path} listeners={listeners} />
      </Box>
    )
  },
  (prev, next) => {
    const equal =
      prev.id === next.id &&
      prev.type === next.type &&
      isEqual(prev.path, next.path)
    return equal
  },
)
