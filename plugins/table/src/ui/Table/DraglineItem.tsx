import { useEffect } from 'react'
import { Box, css } from '@fower/react'
import { motion, useMotionValue } from 'framer-motion'
import { Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { TableElement } from '../../types'

export function DraglineItem({
  id,
  width,
  index,
  colWidths = [],
}: {
  id: string
  index: number
  width: number
  colWidths: number[]
}) {
  const editor = useSlateStatic()

  const initialX = colWidths.slice(0, index + 1).reduce((r, cur) => r + cur, 0)

  const x = useMotionValue(initialX)

  useEffect(() => {
    const initialX = colWidths
      .slice(0, index + 1)
      .reduce((r, cur) => r + cur, 0)
    if (x.get() === initialX) return
    x.set(initialX)
  }, [colWidths, index, x])

  return (
    <motion.div
      contentEditable={false}
      className={css(
        'absolute',
        'w-8',
        'toCenterX',
        'bgTransparent',
        'opacity-0',
        'opacity-100--hover',
        'h-100p',
        'left--4',
        'zIndex-1',
        'selectNone',
        'cursorColResize',
      )}
      dragMomentum={false}
      dragConstraints={{ left: 120 }}
      // onMouseOver={}
      drag="x"
      // whileDrag={{ opacity: 1 }}
      // whileHover={{ opacity: 1 }}
      // whileTap={{ opacity: 1 }}
      style={{ x }}
      onDrag={(_, info) => {
        const offset = info.offset.x
        const newWidth = Number((width + offset).toFixed(0))
        const colClassName = `table-${id}-col-${index}`
        document.querySelectorAll(`.${colClassName}`).forEach((el: any) => {
          el.style.width = `${newWidth}px`
        })
      }}
      onDragEnd={(_, info) => {
        const offset = info.offset.x
        const newWidth = Number((width + offset).toFixed(0))
        const widths = colWidths.map((w, i) => (i === index ? newWidth : w))
        Transforms.setNodes<TableElement>(
          editor,
          { colWidths: widths },
          { at: [], match: (n: any) => n.id === id },
        )
      }}
    >
      <Box bgBrand500 w-2 h-100p>
        &nbsp;
      </Box>
    </motion.div>
  )
}
