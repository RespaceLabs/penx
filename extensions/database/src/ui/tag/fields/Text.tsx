import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { useDebouncedCallback } from 'use-debounce'
import { CellProps } from './CellProps'

export const TextCell: FC<CellProps> = memo(function TextCell(props) {
  const { cell, updateCell } = props
  const [value, setValue] = useState(cell.props.data || '')

  useEffect(() => {
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

  return (
    <Box>
      <TextareaAutosize
        value={value || ''}
        onChange={onChange}
        className={css({
          border: true,
          roundedLG: true,
          w: '100%',
          h: '100%',
          outline: 'none',
          resize: 'none',
          fontFamily: 'unset',
          py: 8,
          px: 8,
          textBase: true,
        })}
      />
    </Box>
  )
})
