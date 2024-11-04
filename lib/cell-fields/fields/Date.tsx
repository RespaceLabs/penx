import React, { FC, memo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { CellProps } from './CellProps'

export const DateCell: FC<CellProps> = memo(function DateCell(props) {
  const { cell, updateCell } = props
  const ref = useRef<HTMLDivElement>(null)
  const [startDate, setStartDate] = useState(cell.props.data ?? null)

  return (
    <div
      ref={ref}
      className="w-full h-full relative inline-flex"
      // css={{
      //   '.react-datepicker-wrapper': {
      //     w: '100%',
      //   },
      //   '.react-datepicker__input-container': {
      //     h: '100%',
      //   },
      //   '.react-datepicker': {
      //     mt: '-6px',
      //     ml: -2,
      //   },
      //   '.date-cell': {
      //     border: true,
      //     h: 40,
      //     roundedLG: true,
      //     outline: 'none',
      //     px: 12,
      //     w: '100%',
      //   },
      // }}
    >
      <DatePicker
        className="date-cell"
        selected={startDate}
        dateFormat="yyyy-MM-dd"
        onChange={(date) => {
          setStartDate(date!)
          updateCell(date!)
        }}
      />
    </div>
  )
})
