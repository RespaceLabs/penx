import { FC, memo } from 'react'
import { Box } from '@fower/react'
import { Path } from 'slate'
import { isBlockquote } from '@penx/blockquote'
import { isHeading } from '@penx/heading'
import { isEqual } from '../../common/utils'
import { DragMenu } from './DragMenu'

interface Props {
  element: any
  path: Path
  listeners: any
}

export const ElementMenu: FC<Props> = memo(
  function ElementMenu({ element, path, listeners }) {
    const { id = '', type } = element as any
    const width = 80

    function h() {
      if (isBlockquote(element)) {
        return '1.5em'
      }
      return isHeading(element) ? '2em' : 'calc(1.5em + 8px)'
    }

    return (
      <Box
        contentEditable={false}
        toCenterY
        toRight
        absolute
        left={-width - 6}
        w={width}
        textBase
        h={h()}
        text3XL={isHeading(element, 'h1')}
        text2XL={isHeading(element, 'h2')}
        textXL={isHeading(element, 'h3')}
        textLG={isHeading(element, 'h4')}
        textSM={isHeading(element, 'h6')}
      >
        <DragMenu id={id} type={type} path={path} listeners={listeners} />
      </Box>
    )
  },
  (prev, next) => {
    const equal =
      prev.element.id === next.element.id &&
      prev.element.type === next.element.type &&
      isEqual(prev.path, next.path)

    return equal
  },
)
