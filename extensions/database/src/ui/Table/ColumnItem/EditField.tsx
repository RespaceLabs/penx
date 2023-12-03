import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { Button, Input, usePopoverContext } from 'uikit'
import { IColumnNode } from '@penx/model-types'
import { FieldSelectPopover } from './FieldSelectPopover'
import { useEditFieldForm } from './useEditFieldForm'

interface EditFieldProps {
  column: IColumnNode
  onSave: () => void
}
export function EditField({ column, onSave }: EditFieldProps) {
  const { close } = usePopoverContext()
  const form = useEditFieldForm(column)
  const { control, formState } = form
  return (
    <Box as="form" p4 column gap3 onSubmit={form.onSubmit}>
      <Box textXS gray500 mb--4>
        Column Name
      </Box>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />
      <Box textXS gray500 mb--4>
        Type
      </Box>
      <Controller
        name="fieldType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <FieldSelectPopover {...field} />}
      />
      <Box toCenterY toRight gap2>
        <Button
          type="button"
          colorScheme="white"
          size="sm"
          onClick={() => close()}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </Box>
    </Box>
  )
}
