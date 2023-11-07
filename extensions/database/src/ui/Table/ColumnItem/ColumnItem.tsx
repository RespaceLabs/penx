import { Box, css, styled } from '@fower/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { IColumnNode } from '@penx/types'
import { columnWidthMotion } from '../../../columnWidthMotion'
import { FieldIcon } from '../FieldIcon'
import { ResizeHandle } from './ResizeHandle'

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
      <ResizeHandle x={x} width={width} column={column} />
    </AnimatedDiv>
  )
}
