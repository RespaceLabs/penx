import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { Maximize2 } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { CellProps } from './CellProps'
import { PrimaryCell } from './PrimaryCell'

export const TextCell: FC<CellProps> = memo(function TextCell(props) {
  const { cell, updateCell, selected, width, index } = props
  const [value, setValue] = useState(cell.props.data || '')

  useEffect(() => {
    if (cell.props.ref) return
    setValue(cell.props.data)
  }, [cell])

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    updateCell(value)
  }, 500)

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const data = e.target.value
    setValue(data)
    debouncedUpdate(data)
  }

  if (cell.props.ref) {
    return <PrimaryCell {...props} />
  }

  return (
    <Box w-100p h-100p relative inlineFlex>
      <TextareaAutosize
        value={value || ''}
        onChange={onChange}
        className={css({
          w: '100%',
          h: '100%',
          outline: 'none',
          resize: 'none',
          fontFamily: 'unset',
          textSM: true,
          py: 8,
          px: 8,
        })}
      />
      {selected && (
        <Box inlineFlex absolute top-8 right-6>
          <Maximize2 size={16} />
        </Box>
      )}
    </Box>
  )
})
