import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useCopyToClipboard } from '@/lib/shared'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
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
    <div>
      <Input
        type={visible ? 'text' : 'password'}
        value={value || ''}
        onChange={onChange}
      />

      <div
        className="cursor-pointer hover:scale-110"
        onClick={() => {
          copy(cell.props.data)
          toast.info('Copied to clipboard')
        }}
      >
        <Copy size={16} />
      </div>
      <div
        className="cursor-pointer hover:scale-110"
        onClick={() => setVisible(!visible)}
      >
        {visible && <EyeOff size={16} />}
        {!visible && <Eye size={16} />}
      </div>
    </div>
  )
})
