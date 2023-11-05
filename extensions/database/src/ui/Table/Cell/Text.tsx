import React, { FC, memo, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { Maximize2 } from 'lucide-react'
import { CellProps } from './CellProps'

// eslint-disable-next-line react/display-name
export const TextCell: FC<CellProps> = memo((props) => {
  const { cell, updateCell, selected, width } = props
  const [value, setValue] = useState(cell.props.data || '')

  useEffect(() => {
    setValue(cell.props.data)
  }, [cell.props.data])

  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    //
  }

  return (
    <Box w-100p h-100p relative inlineFlex>
      <TextareaAutosize
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
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
