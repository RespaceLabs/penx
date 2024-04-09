import { Dispatch, SetStateAction } from 'react'
import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner } from 'uikit'
import { useRecoverFromGoogleForm } from './hooks/useRecoverFromGoogleForm'

interface Props {
  setMnemonic: Dispatch<SetStateAction<string>>
}

export function RecoverFromGoogleForm({ setMnemonic }: Props) {
  const form = useRecoverFromGoogleForm(setMnemonic)
  const { control, formState, loading } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
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
        colorScheme="black"
        roundedFull
        disabled={!isValid || loading}
        gap2
      >
        {loading && <Spinner white square5 />}
        <Box>Restore</Box>
      </Button>
    </Box>
  )
}
