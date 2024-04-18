import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner } from 'uikit'
import { useCloudBackupForm } from './hooks/useCloudBackupForm'

export function CloudBackupForm() {
  const form = useCloudBackupForm()
  const { control, formState, loading } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            autoFocus
            type="password"
            size="lg"
            placeholder="Password"
            {...field}
          />
        )}
      />

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
              size="lg"
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
        size="lg"
        colorScheme="black"
        roundedFull
        disabled={!isValid || loading}
        gap2
      >
        {loading && <Spinner white square5 />}
        <Box>Backup to Google drive</Box>
      </Button>
    </Box>
  )
}
