import { SubmitHandler, useForm } from 'react-hook-form'
import { useDatabaseContext } from '@/lib/database-context'
import { db } from '@/lib/local-db'
import { FieldType, IColumnNode } from '@/lib/model'
import { store } from '@/store'

export type Option = {
  id: string
  name: string
  color: string
}

export type EditFieldValues = {
  displayName: string
  fieldName: string
  fieldType: any
  options: Option[]
}

export function useEditFieldForm(column: IColumnNode) {
  const { options } = useDatabaseContext()
  const optionIds = column.props.optionIds || []
  const columnOptions = optionIds.map((o) => options.find((o2) => o2.id === o)!)

  const form = useForm<EditFieldValues>({
    defaultValues: {
      displayName: column.props.displayName,
      fieldName: column.props.fieldName,
      fieldType: column.props.fieldType,
      options: columnOptions.map((o) => ({
        id: o.id,
        name: o.props.name,
        color: o.props.color,
      })),
    },
  })

  const onSubmit: SubmitHandler<EditFieldValues> = async (data) => {
    console.log('data', data)

    await db.updateNodeProps(column.id, {
      ...column.props,
      ...data,
    })

    if ([FieldType.SINGLE_SELECT].includes(column.props.fieldType)) {
      await db.updateColumnOptions(column.id, data.options || [])
    }

    const nodes = await db.listNodesByUserId()
    store.node.setNodes(nodes)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
