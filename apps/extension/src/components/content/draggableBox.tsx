import { XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'

interface DraggableBoxProps {
  isOpen: boolean
  onClose(): void
}

export const DraggableBox = (props: DraggableBoxProps) => {
  const [doc, setDoc] = useState('')
  const { isOpen, onClose } = props

  const handleChange = (event) => {
    setDoc(event.target.value)
  }

  const onSubmit = () => {
    console.log('Submit doc:', doc)
  }

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            height: '100vh',
          }}>
          <Rnd
            default={{
              // x: 0,
              // y: 0,
              // center
              // x: (window.innerWidth - width) / 2,
              // y: (window.innerHeight - height) / 2,
              // upper right corner
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
            style={{
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #9c27b0',
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
              }}>
              <div style={{ position: 'relative', height: '20px' }}>
                <XCircle
                  style={{ cursor: 'pointer' }}
                  color="#9c27b0"
                  size={20}
                  onClick={() => onClose()}
                />
              </div>

              <textarea
                style={{
                  flex: 4,
                  width: '100%',
                  boxSizing: 'border-box',
                  outline: 'none',
                  border: '1px solid ghostwhite',
                }}
                value={doc}
                onChange={handleChange}
                placeholder="Enter your content..."
              />

              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '30px',
                  maxHeight: '54px',
                }}>
                <button
                  style={{
                    width: '150px',
                    height: '30px',
                    background: '#9c27b0',
                    color: '#fff',
                    borderRadius: '3px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </Rnd>
        </div>
      )}
    </>
  )
}
