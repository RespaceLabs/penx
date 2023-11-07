import { Box, css, styled } from '@fower/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { db } from '@penx/local-db'
import { IColumnNode } from '@penx/types'
import { columnWidthMotion } from '../../columnWidthMotion'
import { FieldIcon } from './FieldIcon'

const AnimatedDiv = styled(motion.div)

interface Props {
  index: number
  column: IColumnNode
}

export const ColumnItem = ({ column, index }: Props) => {
  const { width: w = 120 } = column.props
  const x = useMotionValue(w - 2)
  const width = useTransform(x, (latest) => latest + 2)

  // TODO: hack, save width in store, so we can use it in cell
  columnWidthMotion[column.id] = width

  async function updateWidth() {
    const newWidth = Number(width.get().toFixed(0))
    await db.updateNode(column.id, {
      props: {
        ...column.props,
        width: newWidth,
      },
    })
  }

  return (
    <AnimatedDiv
      borderTop
      borderBottom
      borderRight
      h-40
      toCenterY
      px3
      gap2
      cursorPointer
      relative
      bgGray100--hover
      transitionColors
      style={{
        width,
      }}
    >
      <FieldIcon fieldType={column.props.fieldType} index={index} />
      <Box>{column.props.name}</Box>
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
    </AnimatedDiv>
  )
}
