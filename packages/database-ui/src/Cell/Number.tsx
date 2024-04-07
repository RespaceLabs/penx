import React, {
  ChangeEvent,
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { useDebouncedCallback } from 'use-debounce'
import { matchNumber } from '@penx/shared'
import { CellProps } from './CellProps'

export const NumberCell: FC<CellProps> = memo(function NumberCell(props) {
  const { cell, updateCell, selected, width, index } = props
  const [value, setValue] = useState(cell.props.data || '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cell.props.ref) return
    setValue(cell.props.data)
  }, [cell])

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    updateCell(Number(value))
  }, 500)

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const data = e.target.value
    if (!matchNumber(data) && data.length) {
      // console.log('not a number', data)
      return
    }
    setValue(data)
    debouncedUpdate(data)
  }

  return (
    <Box ref={ref} w-100p h-100p relative inlineFlex>
      <TextareaAutosize
        value={value || ''}
        onChange={onChange}
        className={css({
          w: '100%',
          minH: '100% !important',
          // h: '100%',
          outline: 'none',
          resize: 'none',
          fontFamily: 'unset',
          textSM: true,
          py: 8,
          px: 8,
        })}
      />
    </Box>
  )
})
