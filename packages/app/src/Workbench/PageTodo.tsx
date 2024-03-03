import { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input, InputElement, InputGroup, toast } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { decryptString } from '@penx/encryption'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { store } from '@penx/store'
import { getNodeMap } from '@penx/sync'
import { api } from '@penx/trpc-client'

export const PageTodo = () => {
  useEffect(() => {
    //
    const today = store.node.getTodoNodes()
    console.log('=======today:', today)
  }, [])
  return (
    <Box>
      <Box>GOTO....</Box>
    </Box>
  )
}
