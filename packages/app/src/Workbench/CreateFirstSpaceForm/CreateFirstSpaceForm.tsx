import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, InputGroup, Spinner } from 'uikit'
import { useCreateFirstSpaceForm } from './useCreateFirstSpaceForm'

export function CreateFirstSpaceForm() {
  const form = useCreateFirstSpaceForm()
  const { control, formState, loading } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap8 w={['100%', 400, 520]}>
      <Box text4XL fontBold textCenter mb4>
        Create your first space
      </Box>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <InputGroup>
            <Input
              size={56}
              flex-1
              borderNone
              shadowPopover
              roundedFull
              textBase
              placeholder="Space name"
              {...field}
            />
          </InputGroup>
        )}
      />

      <Box toCenterY toCenterX>
        <Button
          type="submit"
          size={56}
          colorScheme="black"
          w-200
          roundedFull
          disabled={!isValid || loading}
          gap2
        >
          {loading && <Spinner white square5 />}
          <Box>Create</Box>
        </Button>
      </Box>
    </Box>
  )
}
