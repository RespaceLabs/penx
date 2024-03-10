import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, Spinner, useModalContext } from 'uikit'
import { useGenerateReferralCodeForm } from './useGenerateReferralCodeForm'

export function GenerateReferralCodeForm() {
  const { data: loading } = useModalContext<boolean>()
  const form = useGenerateReferralCodeForm()
  const { control, formState } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
      <Controller
        name="code"
        control={control}
        rules={{ required: true, minLength: 4, pattern: /^[a-zA-Z0-9]+$/i }}
        render={({ field }) => (
          <Input
            autoFocus
            size="lg"
            textCenter
            placeholder="Enter a code"
            {...field}
          />
        )}
      />

      <Box toCenterY toRight gap2 mt2>
        <Button
          type="submit"
          size="lg"
          w-100p
          roundedFull
          disabled={!isValid || loading}
          gap2
        >
          {loading && <Spinner white square5 />}
          <Box>Generate</Box>
        </Button>
      </Box>
    </Box>
  )
}
