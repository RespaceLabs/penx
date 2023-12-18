import { Box, styled } from '@fower/react'
import { motion, useMotionValue } from 'framer-motion'
import { SendHorizontal, X } from 'lucide-react'
import React, { forwardRef, useState } from 'react'
import { Button } from 'uikit'

import { slateToNodes } from '@penx/serializer'

import { BACKGROUND_EVENTS } from '~/common/action'
import { SUCCESS } from '~/common/helper'
import { getActiveSpaceId } from '~/hooks/useLocalSpaces'

import * as styles from '../content.module.scss'
import { useContentApp } from '../hooks/useAppType'
import { ContentEditor } from './ContentEditor'

const MotionBox = styled(motion(Box))

interface Props {
  x?: number
  y?: number
}

export const QuickAddEditor = forwardRef<HTMLDivElement, Props>(
  function QuickAddEditor({ x, y }, propsRef) {
    const { destroy } = useContentApp()
    const [value, setValue] = useState<any[]>([])

    const onSubmit = async (editorValue?: any[]) => {
      try {
        const activeSpaceId = await getActiveSpaceId()

        if (!activeSpaceId) {
          alert('Please select a space')
          return
        }

        const nodes = slateToNodes([, editorValue?.[0] || value[0]])

        console.log('content nodes', nodes)

        const data = await chrome.runtime.sendMessage({
          type: BACKGROUND_EVENTS.SUBMIT_CONTENT,
          payload: {
            nodes: nodes.map((node) => ({ ...node, spaceId: activeSpaceId })),
            spaceId: activeSpaceId,
          },
        })

        console.log('======x data:', data)

        destroy()

        // TODO:
        // if (data.code === SUCCESS) {
        //   destroy()
        // }
        console.log('onSubmit res:', data)
      } catch (error) {
        console.log('submit error', error)
      }
    }

    const boxWidth = 560
    const boxHeight = 200

    const posX = x || window.innerWidth / 2 - boxWidth / 2
    const posY = y || window.innerHeight * 0.2

    // const posX = window.innerWidth / 2 - boxWidth / 2
    // const posY = window.innerHeight * 0.2
    // console.log('posX:', posX, 'posY:', posY)
    const containerX = useMotionValue(0)
    const containerY = useMotionValue(0)

    return (
      <MotionBox
        column
        bgWhite
        inlineFlex
        rounded2XL
        // absolute
        fixed
        // minH={boxHeight}
        minW={boxWidth}
        style={{
          x: containerX,
          y: containerY,
          left: posX,
          top: posY,
        }}
        shadow="0 16px 70px rgba(0, 0, 0, 0.2)">
        <MotionBox
          pl5
          toBetween
          pr2
          cursorMove
          pt1
          h-36
          toCenterY
          onPan={(e, info) => {
            containerX.set(containerX.get() + info.delta.x)
            containerY.set(containerY.get() + info.delta.y)
          }}>
          <Box textXL fontMedium black>
            Quick add
          </Box>

          <Box
            gray400
            cursorPointer
            square-28
            toCenter
            mt--2
            onClick={() => destroy()}>
            <X size={20} />
          </Box>
        </MotionBox>

        <Box flex-1 overflowYAuto px2 pb2 minH-100>
          <ContentEditor
            onChange={(value) => {
              setValue(value)
            }}
            onKeyDown={(e, editor) => {
              const canSave = (e.ctrlKey || e.metaKey) && e.key === 'Enter'
              if (canSave) {
                onSubmit(editor?.children)
              }
            }}
          />
        </Box>

        <Box toRight px2 pb2 pt1>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="white"
            gray600
            className={styles.editorBtn}
            onClick={() => onSubmit()}>
            <Box gray500>
              <SendHorizontal size={16} />
            </Box>
            <Box textSM>Send to today</Box>
          </Button>
        </Box>
      </MotionBox>
    )
  },
)
