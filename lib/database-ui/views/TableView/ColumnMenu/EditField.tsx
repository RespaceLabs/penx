import { FormEvent, forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDatabaseContext } from '@/lib/database-context'
import { FieldType, IColumnNode, IOptionNode } from '@/lib/model'
import { ChevronDown, X } from 'lucide-react'
import { FieldSelectPopover } from '../FieldSelectPopover'
import { Option, useEditFieldForm } from '../useEditFieldForm'

interface EditFieldProps {
  column: IColumnNode
  onSave: () => void
  close: () => void
}
export function EditField({ column, onSave, close }: EditFieldProps) {
  const { options } = useDatabaseContext()
  const form = useEditFieldForm(column)
  const { control, formState } = form

  const onSubmit = async (formState: FormEvent<HTMLFormElement>) => {
    await form.onSubmit(formState)
    close()
  }

  return (
    <form
      className="flex flex-col gap-3 p-3"
      onSubmit={(formState) => onSubmit(formState)}
    >
      <div className="text-xs text-foreground/50 -mb-1">Display name</div>
      <Controller
        name="displayName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      <div className="text-xs text-foreground/50 -mb-1">Field name</div>
      <Controller
        name="fieldName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      <div className="text-xs text-foreground/50 -mb-1">Type</div>
      <Controller
        name="fieldType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <FieldSelectPopover {...field} />}
      />

      {column.props.fieldType === FieldType.SINGLE_SELECT && (
        <>
          <div className="text-xs text-foreground/50">Options</div>
          <div className="max-h-[200px] overflow-auto -mx-4 px-4">
            <Controller
              name="options"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <OptionListField {...field} />}
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" size="sm" onClick={() => close()}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </div>
    </form>
  )
}

interface OptionListFieldProps {
  value: Option[]
  onChange: (value: Option[]) => void
}

const OptionListField = forwardRef<HTMLDivElement, OptionListFieldProps>(
  function OptionListField({ value, onChange }, ref) {
    return (
      <div className="space-y-2" ref={ref}>
        {value.map((item, index) => (
          <div className="flex items-center gap-1" key={item.id}>
            <div
              className="mr-1 h-5 w-5 flex items-center justify-center"
              // color--D30={item.color}
              // bg={item.color}
            >
              <ChevronDown size={16} />
            </div>
            <Input
              size="sm"
              placeholder=""
              value={item.name}
              className="flex-1"
              onChange={(e) => {
                const newOptions = [...value]
                newOptions[index].name = e.target.value
                onChange(newOptions)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onChange(value.filter(({ id }) => id !== item.id))
              }}
            >
              <X />
            </Button>
          </div>
        ))}
      </div>
    )
  },
)
