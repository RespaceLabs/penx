import { FC, memo } from 'react'
import { isBlockquote } from '@/editor-extensions/blockquote'
import { isHeading } from '@/editor-extensions/heading'
import { cn } from '@/lib/utils'
import { Path } from 'slate'
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
      <div
        contentEditable={false}
        className={cn(
          'flex items-center justify-end absolute text-base',
          isHeading(element, 'h1') && 'text-3xl',
          isHeading(element, 'h2') && 'text-2xl',
          isHeading(element, 'h3') && 'text-xl',
          isHeading(element, 'h4') && 'text-lg',
          isHeading(element, 'h6') && 'text-sm',
        )}
        style={{
          left: -width - 6,
          width: width,
          height: h(),
        }}
      >
        <DragMenu id={id} type={type} path={path} listeners={listeners} />
      </div>
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
