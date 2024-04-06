import { SubmitHandler, useForm } from 'react-hook-form'
import { usePopoverContext } from 'uikit'
import { db } from '@penx/local-db'
import { FieldType, IColumnNode } from '@penx/model-types'
import { store } from '@penx/store'
import { useDatabaseContext } from '../../DatabaseContext'

export type Option = {
  id: string
  name: string
  color: string
}

export type EditFieldValues = {
  name: string
  fieldType: any
  options: Option[]
}

export function useEditFieldForm(column: IColumnNode) {
  const { close } = usePopoverContext()
  const { options } = useDatabaseContext()
  const optionIds = column.props.optionIds || []
  const columnOptions = optionIds.map((o) => options.find((o2) => o2.id === o)!)

  const form = useForm<EditFieldValues>({
    defaultValues: {
      name: column.props.name,
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

    const nodes = await db.listNodesBySpaceId(column.spaceId)
    store.node.setNodes(nodes)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
