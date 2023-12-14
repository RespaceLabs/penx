import { useState } from 'react'
import { Box, styled } from '@fower/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { IColumnNode } from '@penx/model-types'
import { columnWidthMotion } from '../../../columnWidthMotion'
import { FieldIcon } from '../../shared/FieldIcon'
import { ColumnMenu } from './ColumnMenu'
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

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AnimatedDiv
        borderTop
        borderBottom
        borderRight
        h-40
        toCenterY
        cursorPointer
        relative
        bgGray100--hover
        transitionColors
        style={{
          width,
        }}
      >
        <Popover
          placement="bottom-start"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger asChild>
            <Box
              h-100p
              flex-1
              toCenterY
              textSM
              gray500
              gap2
              px3
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
            >
              <FieldIcon
                fieldType={column.props.fieldType}
                index={index}
                size={14}
              />
              <Box textSM>{column.props.name}</Box>
            </Box>
          </PopoverTrigger>
          <PopoverContent w-240>
            <ColumnMenu index={index} column={column} />
          </PopoverContent>
        </Popover>
        <ResizeHandle x={x} width={width} column={column} />
      </AnimatedDiv>
    </>
  )
}
