import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, ModalClose, Spinner, useModalContext } from 'uikit'
import { SyncServerType } from '@penx/constants'
import { BorderedRadioGroup } from '../../components/BorderedRadioGroup'
import { useCreateSyncServerForm } from './useCreateSyncServerForm'

interface Props {}

export function CreateSyncServerForm({}: Props) {
  const { data: loading } = useModalContext<boolean>()
  const form = useCreateSyncServerForm()
  const { control, formState } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap4 pt3>
      <Box mb--6 fontMedium>
        Sync server name
      </Box>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            autoFocus
            size="lg"
            placeholder="Name your sync server"
            {...field}
          />
        )}
      />

      <Box mb--6 fontMedium>
        Sync server type
      </Box>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <BorderedRadioGroup
            options={[
              { label: 'Public', value: SyncServerType.PUBLIC },
              { label: 'Official', value: SyncServerType.OFFICIAL },
              { label: 'Private', value: SyncServerType.PRIVATE },
            ]}
            {...field}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

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
          <Box>Create</Box>
        </Button>
      </Box>
    </Box>
  )
}
