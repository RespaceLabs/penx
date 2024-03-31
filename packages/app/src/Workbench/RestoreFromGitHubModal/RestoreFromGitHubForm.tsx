import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import {
  Button,
  Checkbox,
  Input,
  ModalClose,
  Spinner,
  Switch,
  useModalContext,
} from 'uikit'
import { useSelectedSpace } from '../VersionControl/hooks/useSelectedSpace'
import { RestoreFromGitHubModalData } from '../VersionControl/types'
import { useRestoreFromGitHubForm } from './useRestoreFromGitHubForm'

export function RestoreFromGitHubForm() {
  const { data } = useModalContext<RestoreFromGitHubModalData>()
  const form = useRestoreFromGitHubForm()
  const { space } = useSelectedSpace()
  const { control, formState } = form
  const { isValid } = formState
  const { loading } = data

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
      <Box mb--6 column gap2 mb4>
        <Box toCenterY gap1>
          <Box>Commit hash:</Box>
          <Box fontMedium>{data.commitHash}</Box>
        </Box>
        <Box toCenterY gap1>
          <Box>Space name:</Box>
          <Box fontMedium>{space.name}</Box>
        </Box>
      </Box>
      {/* <Controller
        name="isOverride"
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChange={(e) => {
              field.onChange(e.target.checked)
            }}
          >
            Is override the existed space?
          </Checkbox>
        )}
      /> */}

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
