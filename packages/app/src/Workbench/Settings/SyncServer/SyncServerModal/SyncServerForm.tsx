import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, ModalClose, Spinner, useModalContext } from 'uikit'
import { isProd, SyncServerType } from '@penx/constants'
import { BorderedRadioGroup } from '../../../../components/BorderedRadioGroup'
import { SyncServerModalData, useSyncServerForm } from './useSyncServerForm'

interface Props {}

export function SyncServerForm({}: Props) {
  const { data } = useModalContext<SyncServerModalData>()
  const form = useSyncServerForm()
  const { control, formState } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gap6>
      <Box column gapy4>
        <Box fontSemibold text2XL>
          {data?.isEditing ? 'Edit sync server' : 'Create sync server'}
        </Box>
      </Box>

      <Box mb--6 fontMedium>
        Sync server name
      </Box>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <Input size="lg" placeholder="Name your sync server" {...field} />
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
              <Input size="lg" placeholder="Sync server url" {...field} />
            )}
          />
        </>
      )}

      {data.isEditing && (
        <>
          <Box mb--6 fontMedium>
            Region
          </Box>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <Input size="lg" placeholder="eg: Paris, France" {...field} />
            )}
          />
        </>
      )}

      <Box toCenterY toRight gap2 mt2>
        <ModalClose>
          <Button type="button" size="lg" roundedFull colorScheme="white" w-120>
            Cancel
          </Button>
        </ModalClose>

        <Button
          type="submit"
          colorScheme="black"
          size="lg"
          roundedFull
          disabled={!isValid || data.isLoading}
          gap2
          w-120
        >
          {data.isLoading && <Spinner white square5 />}
          <Box>{data.isEditing ? 'Edit' : 'Create'}</Box>
        </Button>
      </Box>
    </Box>
  )
}
