import { useState } from 'react'
import { Box } from '@fower/react'
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  toast,
} from 'uikit'
import { useUser } from '@penx/hooks'
import { User } from '@penx/model'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

interface Props {}

export function DisconnectPopover({}: Props) {
  const [loading, setLoading] = useState(false)
  const { id } = useUser()

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="white">Disconnect</Button>
      </PopoverTrigger>
      <PopoverContent>
        {({ close }) => (
          <>
            <PopoverHeader>Sure to disconnect?</PopoverHeader>
            <PopoverBody gap3 toCenterY>
              <Button variant="light" onClick={close} colorScheme="gray600">
                Cancel
              </Button>
              <Button
                disabled={loading}
                gap2
                onClick={async () => {
                  setLoading(true)
                  try {
                    const user = await trpc.user.disconnectRepo.mutate({
                      userId: id,
                    })
                    store.setUser(new User(user))
                    close()
                  } catch (error) {
                    toast.warning('Disconnect GitHub failed')
                  }

                  setLoading(false)
                }}
              >
                {loading && <Spinner white square4 />}
                <Box>Confirm</Box>
              </Button>
            </PopoverBody>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
