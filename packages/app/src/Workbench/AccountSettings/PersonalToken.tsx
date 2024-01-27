import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Code } from 'lucide-react'
import { Button, Input } from 'uikit'
import { trpc } from '@penx/trpc-client'
import { DeleteTokenPopover } from './DeleteTokenPopover'
import { Title } from './Title'
import { useCreateTokenForm } from './useCreateTokenForm'

function TokenList() {
  const { data = [], isLoading } =
    trpc.personalToken.myPersonalTokens.useQuery()

  if (isLoading) return null

  return (
    <Box column gap2 mt6>
      {data.map((item) => (
        <Box key={item.id} toCenterY toBetween gap3>
          <Box toCenterY gap2>
            <Box>{item.description}</Box>
            <Box gray600>{item.value}</Box>
          </Box>
          <DeleteTokenPopover token={item} />
        </Box>
      ))}
    </Box>
  )
}

function AddTokenForm() {
  const form = useCreateTokenForm()
  const { control, formState } = form
  return (
    <Box w-100p>
      <Box as="form" onSubmit={form.onSubmit}>
        <Box toCenterY gap2>
          <Box flex-1>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input placeholder="Token description" {...field} />
              )}
            />
          </Box>

          <Button type="submit" disabled={!formState.isValid}>
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export const PersonalToken = () => {
  return (
    <Box>
      <Title text="PERSONAL TOKEN" />

      <Box>
        <Box column mb4 gap3>
          <Box>
            This is your personal API key. Your personal API key has access to
            all the data.
          </Box>
        </Box>
        <Box gray400>
          To limit the access of a third-party service, consider following these
          instructions to create a read-only API key and sharing that key
          instead.
        </Box>
        <Box mt4>
          <AddTokenForm></AddTokenForm>
          <TokenList />
        </Box>
      </Box>
    </Box>
  )
}
