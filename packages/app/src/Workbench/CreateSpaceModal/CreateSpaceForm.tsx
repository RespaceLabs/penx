import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import {
  Button,
  Checkbox,
  Input,
  ModalClose,
  Spinner,
  useModalContext,
} from 'uikit'
import { ISpace } from '@penx/model-types'
import { useCreateSpaceForm } from './useCreateSpaceForm'

interface Props {
  showCancel?: boolean
}

export function CreateSpaceForm({ showCancel = true }: Props) {
  const { data: loading } = useModalContext<boolean>()
  const form = useCreateSpaceForm()
  const { control, formState } = form
  const { isValid } = formState
  const encrypted = form.watch('encrypted')

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
      <Box mb--6 fontMedium>
        Space Name
      </Box>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input autoFocus size="lg" placeholder="Name your space" {...field} />
        )}
      />

      <Box toCenterY gap1>
        <Controller
          name="encrypted"
          control={control}
          render={({ field }) => (
            <Checkbox
              onChange={(e) => {
                field.onChange(e.target.checked)
              }}
              checked={field.value}
            >
              Enable End-to-End Encryption
            </Checkbox>
          )}
        />
      </Box>

      {encrypted && (
        <Box>
          <Box mb2 fontMedium>
            End-to-End Encryption password
          </Box>
          <Box gray400 leadingNormal textSM mb2>
            The password can be updated in space settings.
          </Box>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input size="lg" type="password" placeholder="" {...field} />
            )}
          />
        </Box>
      )}

      <Box toCenterY toRight gap2 mt2>
        {showCancel && (
          <ModalClose>
            <Button type="button" size="lg" roundedFull colorScheme="white">
              Cancel
            </Button>
          </ModalClose>
        )}
        <Button
          type="submit"
          size="lg"
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
