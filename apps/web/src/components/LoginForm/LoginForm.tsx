import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner } from 'uikit'
import { trpc } from '@penx/trpc-client'
import { useLoginForm } from './useLoginForm'

export function LoginForm() {
  const form = useLoginForm()
  const { control, formState, loading } = form
  const { isValid } = formState
  const { error } = trpc.user.firstUser.useQuery(undefined, { retry: false })

  return (
    <Box
      as="form"
      onSubmit={form.onSubmit}
      column
      gap4
      pt3
      w={['90%', '90%', 380]}
    >
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input size="lg" placeholder="Username" {...field} />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input type="password" size="lg" placeholder="Password" {...field} />
        )}
      />

      <Button
        type="submit"
        size="lg"
        roundedFull
        disabled={!isValid || loading}
        gap2
      >
        {loading && <Spinner white square5 />}
        <Box>Login</Box>
      </Button>

      {error && (
        <Box gray400 textCenter>
          The initial username/password is:{' '}
          <Box inlineFlex black>
            penx/123456
          </Box>
        </Box>
      )}
    </Box>
  )
}
