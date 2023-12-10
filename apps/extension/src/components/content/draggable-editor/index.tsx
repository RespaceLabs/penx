import { Box } from '@fower/react'
import { SendHorizontal, X } from 'lucide-react'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { Rnd } from 'react-rnd'
import { Button } from 'uikit'

import { slateToNodes } from '@penx/serializer'

import { BACKGROUND_EVENTS } from '~/common/action'
import { SUCCESS } from '~/common/helper'
import { useLocalSpaces } from '~/hooks/useLocalSpaces'

import { ContentAppType } from '../constants'
import * as styles from '../content.module.scss'
import { useDoc, useSelectedSpace, useStorageDoc } from '../hooks'
import { ContentEditor } from './ContentEditor'

export interface IDraggableEditorRef {}

interface DraggableEditorProps {
  destroySelectArea: () => void
}

const DraggableEditor = forwardRef<IDraggableEditorRef, DraggableEditorProps>(
  function ScreenShotComponent(props, propsRef) {
    const { destroySelectArea } = props
    const { storageDoc, setStorageDoc } = useStorageDoc()
    const { doc, setDoc } = useDoc()
    const { activeSpaceId } = useLocalSpaces()
    const [value, setValue] = useState([])

    const onSubmit = async () => {
      console.log('..xxxxxxx=======activeSpaceId:', activeSpaceId)

      if (activeSpaceId) {
        const nodes = slateToNodes([, value[0]])
        const data = await chrome.runtime.sendMessage({
          type: BACKGROUND_EVENTS.SUBMIT_CONTENT,
          payload: {
            nodes: nodes.map((node) => ({ ...node, spaceId: activeSpaceId })),
            spaceId: activeSpaceId,
          },
        })

        if (data.code === SUCCESS) {
          setDoc('')
          setStorageDoc('')
          destroySelectArea()
        }
        console.log('onSubmit res:', data)
      } else {
        alert('Please select a space')
      }
    }

    useEffect(() => {
      if (!doc && storageDoc) {
        setDoc(storageDoc)
      }
    }, [storageDoc])

    useImperativeHandle(
      propsRef,
      () => ({
        type: ContentAppType.areaSelect,
      }),
      [],
    )

    const boxWidth = 560
    const boxHeight = 200

    return (
      <Box className={styles.draggableContainer}>
        <Rnd
          default={{
            x: window.innerWidth / 2 - boxWidth / 2,
            y: window.innerHeight * 0.2,
            width: boxWidth,
            height: boxHeight,
          }}
          minWidth={300}
          minHeight={240}
          maxWidth={800}
          maxHeight={480}
          bounds="window"
          className={styles.rndContainer}>
          <Box px1 py3 column h-100p>
            <Box pl5 toBetween mb2 pr2>
              <Box textXL fontMedium>
                Quick add
              </Box>

              <Box
                gray400
                cursorPointer
                square-28
                toCenter
                mt--2
                onClick={() => destroySelectArea()}>
                <X size={20} />
              </Box>
            </Box>

            <Box flex-1 overflowYAuto>
              <ContentEditor
                onChange={(value) => {
                  setValue(value)
                }}
              />
            </Box>

            <Box toRight px5 pb1 pt1>
              <Button
                size="sm"
                variant="light"
                colorScheme="white"
                gray600
                className={styles.editorBtn}
                onClick={onSubmit}>
                <Box gray500>
                  <SendHorizontal size={16} />
                </Box>
                <Box textSM>Send to today</Box>
              </Button>
            </Box>
          </Box>
        </Rnd>
      </Box>
    )
  },
)

DraggableEditor.displayName = 'DraggableEditor'

export default DraggableEditor
