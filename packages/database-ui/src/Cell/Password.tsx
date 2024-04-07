import React, {
  ChangeEvent,
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Box } from '@fower/react'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { Input, InputElement, InputGroup, toast } from 'uikit'
import { useCopyToClipboard } from '@penx/shared'
import { CellProps } from './CellProps'

export const PasswordCell: FC<CellProps> = memo(function PasswordCell(props) {
  const { cell, updateCell } = props
  const [value, setValue] = useState(cell.props.data || '')
  const ref = useRef<HTMLDivElement>(null)
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
    <Box ref={ref} w-100p h-100p relative inlineFlex>
      <InputGroup flex-1>
        <Input
          type={visible ? 'text' : 'password'}
          variant="unstyled"
          value={value || ''}
          onChange={onChange}
          flex-1
          px2
          // w-100p
          h-100p
        />
        <InputElement gray500 h-100p toCenterY gap1 pr2>
          <Box
            cursorPointer
            scale-110--hover
            onClick={() => {
              copy(value)
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
