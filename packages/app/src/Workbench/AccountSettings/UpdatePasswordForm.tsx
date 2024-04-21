import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner } from 'uikit'
import { useUpdatePasswordForm } from './hooks/useUpdatePasswordForm'

export function UpdatePasswordForm() {
  const form = useUpdatePasswordForm()
  const { control, formState, loading } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4>
      <Box mb--8 textSM gray500>
        Username
      </Box>
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input placeholder="Username" {...field} />}
      />

      <Box mb--8 textSM gray500>
        Password
      </Box>
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input type="password" placeholder="Password" {...field} />
        )}
      />

      <Box mb--8 textSM gray500>
        Confirm password
      </Box>
      <Controller
        name="passwordConfirm"
        control={control}
        rules={{
          required: true,
          validate: (value, values) => {
            if (value !== values.password) {
              return 'Passwords do not match'
            }
            return true
          },
        }}
        render={({ field, fieldState }) => (
          <Box>
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              {...field}
            />

            <Box red500 mt1 textSM>
              {fieldState.error?.message}
            </Box>
          </Box>
        )}
      />

      <Button
        type="submit"
        colorScheme="black"
        roundedFull
        disabled={!isValid || loading}
        gap2
      >
        {loading && <Spinner white square5 />}
        <Box>Confirm</Box>
      </Button>
    </Box>
  )
}
