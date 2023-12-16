import { Box, css, styled } from '@fower/react'
import { motion, MotionValue } from 'framer-motion'
import { db } from '@penx/local-db'
import { IColumnNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'

interface Props {
  x: MotionValue<number>
  width: MotionValue<number>
  column: IColumnNode
}

export const ResizeHandle = ({ x, width, column }: Props) => {
  const { currentView } = useDatabaseContext()
  async function updateWidth() {
    const newWidth = Number(width.get().toFixed(0))
    await db.updateViewColumn(currentView.id, column.id, {
      width: newWidth,
    })
  }

  return (
    <motion.div
      className={css(
        'zIndex-10000',
        'absolute',
        'left--2',
        'w-4',
        'h-100p',
        'bgTransparent',
        'transitionColors',
        {
          ':hover': {
            bgBrand300: true,
            cursor: 'col-resize',
          },
        },
      )}
      dragMomentum={false}
      dragConstraints={{
        left: 80,
      }}
      drag="x"
      style={{ x }}
      onDragEnd={() => {
        updateWidth()
      }}
    />
  )
}
