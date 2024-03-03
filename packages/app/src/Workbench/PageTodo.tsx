import { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input, InputElement, InputGroup, toast } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { decryptString } from '@penx/encryption'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export const PageTodo = () => {
  useEffect(() => {
    //
  }, [])
  return (
    <Box>
      <Box>GOTO....</Box>
    </Box>
  )
}
