import React, {
  ChangeEvent,
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from 'uikit'
import { matchNumber } from '@penx/shared'
import { CellProps } from './CellProps'

export const NumberCell: FC<CellProps> = memo(function NumberCell(props) {
  const { cell, updateCell, index } = props
  const [value, setValue] = useState(cell.props.data || '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cell.props.ref) return
    setValue(cell.props.data)
  }, [cell])

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    updateCell(Number(value))
  }, 500)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const data = e.target.value
    if (!matchNumber(data) && data.length) {
      // console.log('not a number', data)
      return
    }
    setValue(data)
    debouncedUpdate(data)
  }

  return <Input value={value || ''} onChange={onChange} />
})
