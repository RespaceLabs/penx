import { Box } from '@fower/react'
import { Button, Input, ModalClose } from 'uikit'
import { useImportSpaceForm } from '@penx/hooks'

export function ImportSpaceForm() {
  const form = useImportSpaceForm()
  const { register, control, formState } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gapY2 pt3>
      <Input
        textCenter
        placeholder="GitHub token"
        size="lg"
        {...register('githubToken')}
      />

      <Input
        textCenter
        placeholder="GitHub Repo"
        size="lg"
        {...register('repo')}
      />

      <Box toCenter gapX4 mt10>
        <ModalClose>
          <Button type="button" roundedFull colorScheme="white">
            Cancel
          </Button>
        </ModalClose>

        <Button
          type="submit"
          colorScheme="red500"
          roundedFull
          disabled={!isValid}
          gap2
        >
          Import
        </Button>
      </Box>
    </Box>
  )
}
