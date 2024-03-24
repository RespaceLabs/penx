import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, ModalClose, Spinner, useModalContext } from 'uikit'
import { isProd, SyncServerType } from '@penx/constants'
import { trpc } from '@penx/trpc-client'
import { BorderedRadioGroup } from '../../components/BorderedRadioGroup'
import { SyncServerModalData, useSyncServerForm } from './useSyncServerForm'

interface Props {}

export function SyncServerForm({}: Props) {
  const { data } = useModalContext<SyncServerModalData>()
  const form = useSyncServerForm()
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
        defaultValue=""
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
        rules={{ required: true }}
        render={({ field }) => (
          <BorderedRadioGroup
            options={[
              { label: 'Public', value: SyncServerType.PUBLIC },
              {
                label: 'Private',
                value: SyncServerType.PRIVATE,
              },
              {
                label: 'Official',
                value: SyncServerType.OFFICIAL,
                disabled: isProd,
              },
            ]}
            {...field}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {data.isEditing && (
        <>
          <Box mb--6 fontMedium>
            Sync server URL
          </Box>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <Input
                autoFocus
                size="lg"
                placeholder="Sync server url"
                {...field}
              />
            )}
          />
        </>
      )}

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
          disabled={!isValid || data.isLoading}
          gap2
        >
          {data.isLoading && <Spinner white square5 />}
          <Box>Create</Box>
        </Button>
      </Box>
    </Box>
  )
}
