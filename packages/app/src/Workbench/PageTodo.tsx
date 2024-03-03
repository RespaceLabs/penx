import { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { format } from 'date-fns'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input, InputElement, InputGroup, toast } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { TODO_DATABASE_NAME } from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export const PageTodo = () => {
  useEffect(() => {
    const todo = store.node.getDatabaseByName(TODO_DATABASE_NAME)
    const database = store.node.getDatabase(todo!.id)
    console.log('=======todo:', database)
    const todayRows = database.rows.filter((r) => {
      return true
    })

    console.log('todayRows:', todayRows)
  }, [])
  return (
    <Box>
      <Box>GOTO....</Box>
    </Box>
  )
}
