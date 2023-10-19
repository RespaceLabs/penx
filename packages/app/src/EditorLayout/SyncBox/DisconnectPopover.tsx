import { Box } from '@fower/react'
import { useAccount } from 'wagmi'
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
} from 'uikit'
import { useSpaces } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'

interface Props {}

export function DisconnectPopover({}: Props) {
  const { address = '' } = useAccount()
  const { activeSpace } = useSpaces()
  // const { mutateAsync: disconnect, isLoading } =
  //   api.space.disconnectRepo.useMutation()
  // const loading = isSpaceLoading || isLoading
  const loading = false

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="white">Disconnect</Button>
      </PopoverTrigger>
      <PopoverContent>
        {({ close }) => (
          <>
            <PopoverHeader>Sure to disconnect?</PopoverHeader>
            <PopoverBody spaceX3>
              <Button variant="light" onClick={close} colorScheme="gray600">
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={async () => {
                  await trpc.user.disconnectRepo.mutate({
                    address,
                    spaceId: activeSpace.id,
                  })

                  // close()
                  // await refetch()
                }}
              >
                {loading && <Spinner />}
                <Box>Confirm</Box>
              </Button>
            </PopoverBody>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
