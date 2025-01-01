import { Block } from '@/server/db/schema'
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import Link from 'next/link'
import { Node } from 'slate'
import { PlateEditor } from '../editor/plate-editor'
import LoadingCircle from '../icons/loading-circle'
import { Button } from '../ui/button'

interface RefCellProps {
  kind: 'ref-cell'
  data: {
    refType: 'BLOCK' | 'PAGE'
    id: string
  }
  block?: Block
}

export type RefCell = CustomCell<RefCellProps>

const getTextFromChildren = (children: any[], renderTag: boolean) => {
  if (!renderTag) {
    const notRenderTagChildren = children.filter(
      (item: any) => item?.type !== 'tag',
    ) as { text: string; type?: string }[]
    return notRenderTagChildren.map((item) => item.text).join('')
  }

  return children.reduce((acc: string, child: any) => {
    if (child?.type === 'tag') {
      return acc + ('#' + child?.value || '')
    }
    return acc + Node.string(child)
  }, '')
}

export const generateRefCellText = (block: Block, renderTag = true): string => {
  const elements = Array.isArray(block.content)
    ? block.content
    : [block.content]

  const text = elements
    .map((element: any) => {
      if (Array.isArray(element.children)) {
        return getTextFromChildren(element.children, renderTag)
      } else {
        return Node.string(element)
      }
    })
    .join('')

  return text
}

export const refCellRenderer: CustomRenderer<RefCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is RefCell => (c.data as any).kind === 'ref-cell',
  draw: (args, cell) => {
    const { block } = cell.data

    if (!block) {
      const { ctx, theme, rect, requestAnimationFrame } = args

      const progress = (window.performance.now() % 1000) / 1000

      const x = rect.x + rect.width / 2
      const y = rect.y + rect.height / 2
      ctx.beginPath()
      ctx.arc(
        x,
        y,
        Math.min(12, rect.height / 6),
        Math.PI * 2 * progress,
        Math.PI * 2 * progress + Math.PI * 1.5,
      )

      ctx.strokeStyle = theme.textMedium
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.lineWidth = 1

      requestAnimationFrame()
      return true
    }

    const text = generateRefCellText(block)
    drawTextCell(args, text)
  },
  provideEditor: () => ({
    editor: (p) => {
      const { value, onChange, onFinishedEditing } = p
      const { block } = value.data

      if (!block) return <LoadingCircle />
      return (
        <div className="w-64 py-1 flex flex-col gap-1">
          <PlateEditor
            className="w-full pt-0 px-0"
            value={[block.content]}
            readonly
          />
          <div className="flex justify-center">
            <Button asChild size="xs" variant="secondary" className="text-xs">
              <Link href={`/~/page?id=${block.pageId}`}>Go to page</Link>
            </Button>
          </div>
        </div>
      )
    },
  }),
}
