import { Box } from '@fower/react'
import { Button, Input, ModalClose } from 'uikit'
import { useCreateSpaceForm } from '@penx/hooks'
import { ISpace } from '@penx/types'

interface Props {
  showCancel?: boolean
  onSpaceCreated?: (space: ISpace) => void
}

export function CreateSpaceForm({ showCancel = true, onSpaceCreated }: Props) {
  const form = useCreateSpaceForm(onSpaceCreated)
  const { register, control, formState } = form
  const { isValid } = formState

  return (
    <Box as="form" onSubmit={form.onSubmit} column gapY2 pt3>
      <Input
        textCenter
        placeholder="Display Name"
        size="lg"
        {...register('name')}
      />

      <Box toCenter gapX4 mt10>
        {showCancel && (
          <ModalClose>
            <Button type="button" roundedFull colorScheme="white">
              Cancel
            </Button>
          </ModalClose>
        )}
        <Button
          type="submit"
          colorScheme="red500"
          roundedFull
          disabled={!isValid}
          gap2
        >
          Create
        </Button>
      </Box>
    </Box>
  )
}
