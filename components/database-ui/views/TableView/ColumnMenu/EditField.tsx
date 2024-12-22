'use client'

import { FormEvent, forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { ChevronDown, X } from 'lucide-react'
import { useDatabaseContext } from '@/components/database-ui/DatabaseProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldType, Option } from '@/lib/types'
import { Field } from '@/server/db/schema'
import { Box } from '@fower/react'
import { FieldSelectPopover } from '../FieldSelectPopover'
import { useEditFieldForm } from '../useEditFieldForm'

interface EditFieldProps {
  field: Field
  onSave: () => void
  onCancel: () => void
  close: () => void
}
export function EditField({ field, onSave, onCancel, close }: EditFieldProps) {
  const { database } = useDatabaseContext()
  const form = useEditFieldForm(field)
  const { control, formState } = form

  const onSubmit = async (formState: FormEvent<HTMLDivElement>) => {
    await form.onSubmit(formState)
    close()
  }

  return (
    <Box as="form" column gap3 p3 onSubmit={(formState) => onSubmit(formState)}>
      <Box textXS gray500 mb--4>
        Display name
      </Box>
      <Controller
        name="displayName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      <Box textXS gray500 mb--4>
        Field name
      </Box>
      <Controller
        name="fieldName"
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

      {field.fieldType === FieldType.SINGLE_SELECT && (
        <>
          <Box textXS gray500>
            Options
          </Box>
          <Box maxH-200 overflowAuto mx--16 px4>
            <Controller
              name="options"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <OptionListField {...field} />}
            />
          </Box>
        </>
      )}

      <Box toCenterY toRight gap2>
        <Button variant="outline" type="button" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </Box>
    </Box>
  )
}

interface OptionListFieldProps {
  value: Option[]
  onChange: (value: Option[]) => void
}

const OptionListField = forwardRef<HTMLDivElement, OptionListFieldProps>(
  function OptionListField({ value, onChange }, ref) {
    return (
      <Box column gap2 ref={ref}>
        {value.map((item, index) => (
          <Box key={item.id} toCenterY gap1>
            <Box mr1 circle5 toCenter color--D30={item.color} bg={item.color}>
              <ChevronDown size={16} />
            </Box>
            <Input
              size="sm"
              placeholder=""
              value={item.name}
              onChange={(e) => {
                const newOptions = [...value]
                newOptions[index].name = e.target.value
                onChange(newOptions)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                onChange(value.filter(({ id }) => id !== item.id))
              }}
            >
              <X />
            </Button>
          </Box>
        ))}
      </Box>
    )
  },
)
