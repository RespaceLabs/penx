import { Box } from '@fower/react'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
  usePopoverContext,
} from 'uikit'
import { PersonalToken } from '@penx/db'
import { api, trpc } from '@penx/trpc-client'

type Props = {
  token: PersonalToken
}

export const DeleteTokenPopover = ({ token }: Props) => {
  const { refetch } = trpc.personalToken.myPersonalTokens.useQuery()
  const { close } = usePopoverContext()

  async function deleteToken(close: () => void) {
    try {
      await api.personalToken.deleteById.mutate(token.id)
      await refetch()
      close()
    } catch (error) {
      toast.error('Failed to delete token')
    }
  }
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button size="sm" variant="light" colorScheme="red500">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent p5 w-260>
        {({ close }) => (
          <Box>
            <Box mb4 leadingNormal>
              Are you sure you want to delete this personal token?
            </Box>
            <Box>
              <Box toCenterY toRight gap2>
                <Button
                  colorScheme="white"
                  size="sm"
                  variant="light"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red500"
                  size="sm"
                  type="submit"
                  onClick={() => deleteToken(close)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </PopoverContent>
    </Popover>
  )
}
