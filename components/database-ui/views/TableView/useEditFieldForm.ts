'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Option } from '@/lib/types'
import { Field } from '@/server/db/schema'
import { useDatabaseContext } from '../../DatabaseProvider'

export type EditFieldValues = {
  displayName: string
  fieldName: string
  fieldType: any
  options: Option[]
}

export function useEditFieldForm(field: Field) {
  const { database } = useDatabaseContext()
  const columnOptions = (field.options as Option[]) || []

  console.log('====field:', field)

  const form = useForm<EditFieldValues>({
    defaultValues: {
      displayName: field.displayName || '',
      fieldName: field.name,
      fieldType: field.fieldType,
      options: columnOptions.map((o) => ({
        id: o.id,
        name: o.name,
        color: o.color,
      })),
    },
  })

  const onSubmit: SubmitHandler<EditFieldValues> = async (data) => {
    // console.log('data', data)
    // await db.updateNodeProps(column.id, {
    //   ...column.props,
    //   ...data,
    // })
    // if ([FieldType.SINGLE_SELECT].includes(column.props.fieldType)) {
    //   await db.updateColumnOptions(column.id, data.options || [])
    // }
    // const nodes = await db.listNodesBySpaceId(column.spaceId)
    // store.node.setNodes(nodes)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
