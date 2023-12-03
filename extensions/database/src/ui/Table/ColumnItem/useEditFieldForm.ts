import { SubmitHandler, useForm } from 'react-hook-form'
import { usePopoverContext } from 'uikit'
import { db } from '@penx/local-db'
import { IColumnNode } from '@penx/model-types'
import { store } from '@penx/store'

export type EditFieldValues = {
  name: string
  fieldType: any
}

export function useEditFieldForm(column: IColumnNode) {
  const { close } = usePopoverContext()
  const form = useForm<EditFieldValues>({
    defaultValues: {
      name: column.props.name,
      fieldType: column.props.fieldType,
    },
  })

  const onSubmit: SubmitHandler<EditFieldValues> = async (data) => {
    await db.updateNodeProps(column.id, {
      ...column.props,
      ...data,
    })
    const nodes = await db.listNodesBySpaceId(column.spaceId)
    store.node.setNodes(nodes)
    close()
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
