import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import {
  Button,
  Input,
  ModalClose,
  Spinner,
  Switch,
  useModalContext,
} from 'uikit'
import { ISpace } from '@penx/model-types'
import { useRestoreFromGitHubForm } from './useRestoreFromGitHubForm'

export function RestoreFromGitHubForm() {
  const { data: loading } = useModalContext<boolean>()
  const form = useRestoreFromGitHubForm()
  const { control, formState } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
      <Box mb--6 column gap2>
        <Box fontMedium>GitHub backup url with space ID and commit hash</Box>
        <Box textSM gray400 leadingTight>
          eg:
          https://github.com/penxio/penx-101/tree/42577be7d9fe2d259c913d000a0b58d686784ff9/3264fdaa-6e48-4ca5-bb1f-4e553bb5d78b
        </Box>
      </Box>
      <Controller
        name="url"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            autoFocus
            size="lg"
            placeholder="GitHub backup url with space ID and commit hash"
            {...field}
          />
        )}
      />

      <Box>
        <Box mb2 fontMedium>
          End-to-End Encryption password
        </Box>
        <Box gray400 leadingNormal textSM mb2>
          If this space is encrypted, password will be required to decrypt it.
        </Box>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input size="lg" type="password" placeholder="" {...field} />
          )}
        />
      </Box>

      <Box toCenterY toRight gap2 mt2>
        <ModalClose>
          <Button type="button" size="lg" roundedFull colorScheme="white">
            Cancel
          </Button>
        </ModalClose>

        <Button
          type="submit"
          size="lg"
          roundedFull
          disabled={!isValid || loading}
          gap2
        >
          {loading && <Spinner white square5 />}
          <Box>Restore</Box>
        </Button>
      </Box>
    </Box>
  )
}
