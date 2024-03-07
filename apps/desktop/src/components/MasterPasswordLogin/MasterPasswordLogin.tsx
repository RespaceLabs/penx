import { FC, useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { set } from 'idb-keyval'
import { Button, Input, InputGroup, Spinner, toast } from 'uikit'
import { MASTER_PASSWORD } from '@penx/constants'
import { db } from '@penx/local-db'
import { api } from '@penx/trpc-client'

declare module '@fower/atomic-props' {
  export interface AtomicProps {
    shadowPopover?: boolean
  }
}

interface Props {
  refetch: any
}

export const MasterPasswordLogin: FC<Props> = ({ refetch }) => {
  const [value, setValue] = useState('')

  const { data: isNewUser, isLoading } = useQuery(['isNewUser'], async () => {
    const localSpaces = await db.listSpaces()
    if (localSpaces.length) return false
    const remoteSpaces = await api.space.mySpaces.query()
    if (remoteSpaces.length) return false
    return true
  })

  async function confirm() {
    if (!value) return toast.error('Please enter your master password')
    await set(MASTER_PASSWORD, value)
    await refetch()
  }

  return (
    <Box column gap8 w={['100%', 400, 500]}>
      <Box>
        <Box text4XL fontBold textCenter>
          Your master password
        </Box>
        <Box textCenter gray600 leadingNormal textSM>
          Your master password is empty, please enter it to sync your data!
        </Box>
      </Box>

      <InputGroup>
        <Input
          size={56}
          flex-1
          borderNone
          shadowPopover
          roundedFull
          textBase
          // shadow3XL
          placeholder="Enter master password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
      </InputGroup>

      <Box toCenterY gap2 toCenterX>
        <Button size="lg" w-200 roundedFull onClick={() => confirm()}>
          {isLoading && <Spinner white></Spinner>}
          {!isLoading && (isNewUser ? 'Save new password' : 'Confirm')}
        </Button>
      </Box>
    </Box>
  )
}
