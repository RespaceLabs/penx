import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
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
    <div>
      <TextareaAutosize
        value={value || ''}
        onChange={onChange}
        className="border rounded-lg w-full h-full outline-none resize-none py-2 px-2"
      />
    </div>
  )
})
