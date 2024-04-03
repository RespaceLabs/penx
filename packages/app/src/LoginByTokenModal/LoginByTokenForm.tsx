import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner } from 'uikit'
import { useLoginByTokenForm } from './useLoginByTokenForm'

export function LoginByTokenForm() {
  const form = useLoginByTokenForm()
  const { control, formState, loading } = form

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap6 pt3>
      <Controller
        name="token"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input size="lg" placeholder="Your personal token" {...field} />
        )}
      />

      <Button
        type="submit"
        size="lg"
        w-100p
        disabled={loading || !formState.isValid}
      >
        {loading && <Spinner white />}
        <Box>Login</Box>
      </Button>
    </Box>
  )
}
