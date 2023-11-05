import TextareaAutosize from 'react-textarea-autosize'
import { Box, css } from '@fower/react'
import { DatabaseIcon } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { db } from '@penx/local-db'
import { useDatabaseContext } from './DatabaseContext'

export const DatabaseHeader = () => {
  const { database } = useDatabaseContext()

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    await db.updateNode(database.id, {
      props: { name: value },
    })
  }, 500)

  return (
    <Box toCenterY pb1>
      <Box inlineFlex gray600>
        <DatabaseIcon size={16} />
      </Box>
      <TextareaAutosize
        placeholder="Database name"
        rows={1}
        defaultValue={database.props.name || ''}
        onChange={(e) => {
          debouncedUpdate(e.target.value)
        }}
        className={css({
          textSM: true,
          flex: 1,
          width: '100%',
          fontFamily: 'unset',
          outline: 'none',
          resize: 'none',
        })}
      />
    </Box>
  )
}
