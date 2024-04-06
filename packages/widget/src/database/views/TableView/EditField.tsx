import { FormEvent, forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { Box } from '@fower/react'
import { ChevronDown, X } from 'lucide-react'
import { Button, Input, usePopoverContext } from 'uikit'
import { FieldType, IColumnNode, IOptionNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { FieldSelectPopover } from './FieldSelectPopover'
import { Option, useEditFieldForm } from './useEditFieldForm'

interface EditFieldProps {
  column: IColumnNode
  onSave: () => void
  close: () => void
}
export function EditField({ column, onSave, close }: EditFieldProps) {
  const { options } = useDatabaseContext()
  const form = useEditFieldForm(column)
  const { control, formState } = form

  const onSubmit = async (formState: FormEvent<HTMLDivElement>) => {
    await form.onSubmit(formState)
    close()
  }

  return (
    <Box as="form" p4 column gap3 onSubmit={(formState) => onSubmit(formState)}>
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

      {column.props.fieldType === FieldType.SINGLE_SELECT && (
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
              flex-1
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
              isSquare
              size={24}
              colorScheme="gray600"
              variant="ghost"
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
