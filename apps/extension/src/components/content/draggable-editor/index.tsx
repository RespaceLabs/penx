import { Box } from '@fower/react'
import { XCircle } from 'lucide-react'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Rnd } from 'react-rnd'

import { BACKGROUND_EVENTS } from '~/common/action'
import { SUCCESS } from '~/common/helper'

import * as styles from '../content.module.css'
import { StartSelectEnum } from '../helper'
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
    const { selectedSpace } = useSelectedSpace()

    const handleChange = (event) => {
      const newValue = event.target.value
      setDoc(newValue)
      setStorageDoc(newValue)
    }

    const onSubmit = async () => {
      if (selectedSpace) {
        const data = await chrome.runtime.sendMessage({
          type: BACKGROUND_EVENTS.SUBMIT_CONTENT,
          payload: { doc, spaceId: selectedSpace },
        })

        if (data.code === SUCCESS) {
          setDoc('')
          setStorageDoc('')
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
        type: StartSelectEnum.areaSelect,
      }),
      [],
    )

    return (
      <div className={styles.draggableContainer}>
        <Rnd
          default={{
            x: window.innerWidth - 470,
            y: 20,
            width: 450,
            height: 260,
          }}
          minWidth={280}
          minHeight={240}
          maxWidth={800}
          maxHeight={480}
          bounds="window"
          className={styles.rndContainer}>
          <div className={styles.editorContainer}>
            <div className={styles.editorTop}>
              <XCircle
                style={{ cursor: 'pointer' }}
                color="#000000"
                size={20}
                onClick={() => destroySelectArea()}
              />
            </div>

            <ContentEditor />

            {/* <textarea
              style={{
                flex: 4,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
                border: '1px solid ghostwhite',
                background: '#f9f9f9',
                color: '#262626',
              }}
              value={doc}
              onChange={handleChange}
              placeholder="Enter your content..."
            /> */}

            <div className={styles.editorBottom}>
              <button className={styles.editorBtn} onClick={onSubmit}>
                Submit
              </button>
            </div>
          </div>
        </Rnd>
      </div>
    )
  },
)

DraggableEditor.displayName = 'DraggableEditor'

export default DraggableEditor
