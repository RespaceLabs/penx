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
import { BorderedRadioGroup } from '../../components/BorderedRadioGroup'
import { SpaceType, useCreateSpaceForm } from './useCreateSpaceForm'

interface Props {
  showCancel?: boolean
  onSpaceCreated?: (space: ISpace) => void
}

export function CreateSpaceForm({ showCancel = true, onSpaceCreated }: Props) {
  const { data: loading } = useModalContext<boolean>()
  const form = useCreateSpaceForm(onSpaceCreated)
  const { control, formState } = form
  const { isValid } = formState
  const encrypted = form.watch('encrypted')
  const type = form.watch('type')

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

      <Box mb--6 fontMedium>
        Type
      </Box>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <BorderedRadioGroup
            options={[
              { label: 'Local space', value: SpaceType.LOCAL },
              { label: 'Cloud space', value: SpaceType.CLOUD },
            ]}
            {...field}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {type === SpaceType.CLOUD && (
        <>
          <Box mb--6 column gap2>
            <Box fontMedium>Invitation Code</Box>
            <Box textSM gray400>
              Currently cloud space should have a invitation code
            </Box>
          </Box>
          <Controller
            name="invitationCode"
            control={control}
            render={({ field }) => (
              <Input autoFocus size="lg" placeholder="" {...field} />
            )}
          />
        </>
      )}

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
