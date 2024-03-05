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
import { EditorMode } from '@penx/model-types'
import { BorderedRadioGroup } from '../../components/BorderedRadioGroup'
import { useCreateSpaceForm } from './useCreateSpaceForm'

interface Props {
  showCancel?: boolean
}

export function CreateSpaceForm({ showCancel = true }: Props) {
  const { data: loading } = useModalContext<boolean>()
  const form = useCreateSpaceForm()
  const { control, formState } = form
  const { isValid } = formState

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
        Editor mode
      </Box>
      <Controller
        name="editorMode"
        control={control}
        render={({ field }) => (
          <BorderedRadioGroup
            options={[
              { label: 'Block', value: EditorMode.BLOCK },
              { label: 'Outliner', value: EditorMode.OUTLINER },
            ]}
            {...field}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

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
