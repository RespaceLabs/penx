import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { Input, InputElement, InputGroup, toast } from 'uikit'
import { useCopyToClipboard } from '@penx/shared'
import { CellProps } from './CellProps'

export const PasswordCell: FC<CellProps> = memo(function PasswordCell(props) {
  const { cell, updateCell } = props
  const [value, setValue] = useState(cell.props.data || '')

  const [visible, setVisible] = useState(false)
  const { copy } = useCopyToClipboard()

  useEffect(() => {
    if (cell.props.ref) return
    setValue(cell.props.data)
  }, [cell])

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    updateCell(value)
  }, 500)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const data = e.target.value
    setValue(data)
    debouncedUpdate(data)
  }

  return (
    <Box>
      <InputGroup>
        <Input
          type={visible ? 'text' : 'password'}
          value={value || ''}
          onChange={onChange}
          px2
          w-100p
        />
        <InputElement gray500 h-100p toCenterY gap1 pr2>
          <Box
            cursorPointer
            scale-110--hover
            onClick={() => {
              copy(cell.props.data)
              toast.info('Copied to clipboard')
            }}
          >
            <Copy size={16} />
          </Box>
          <Box
            cursorPointer
            scale-110--hover
            onClick={() => setVisible(!visible)}
          >
            {visible && <EyeOff size={16} />}
            {!visible && <Eye size={16} />}
          </Box>
        </InputElement>
      </InputGroup>
    </Box>
  )
})
