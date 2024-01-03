import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner } from 'uikit'
import { useLoginForm } from './useLoginForm'

interface Props {
  showCancel?: boolean
}

export function LoginForm() {
  const form = useLoginForm()
  const { control, formState, loading } = form
  const { isValid } = formState

  return (
    <Box
      as="form"
      onSubmit={form.onSubmit}
      column
      gap4
      pt3
      w={['90%', '90%', 360]}
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
    </Box>
  )
}
