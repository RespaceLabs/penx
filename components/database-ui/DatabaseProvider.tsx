'use client'

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { getRandomColorName } from '@/lib/color-helper'
import { useQueryDatabase } from '@/lib/hooks/useQueryDatabase'
import { IFilterResult, IOptionNode } from '@/lib/model'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import {
  FieldType,
  Filter,
  Group,
  Option,
  Sort,
  ViewField,
  ViewType,
} from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { RouterInputs, RouterOutputs } from '@/server/_app'
import { Field, Record as Row, View } from '@/server/db/schema'
import { useQuery } from '@tanstack/react-query'
import { arrayMoveImmutable } from 'array-move'
import { produce } from 'immer'
import { useSearchParams } from 'next/navigation'

type DatabaseView = Omit<View, 'viewFields'> & {
  viewFields: ViewField[]
}

type DatabaseRecord = Omit<Row, 'fields'> & {
  fields: Record<string, any>
}

export type Database = Omit<RouterOutputs['database']['byId'], 'view'> & {
  viewIds: string[]
  views: DatabaseView[]
  records: DatabaseRecord[]
}

type UpdateDatabaseInput = Omit<
  RouterInputs['database']['updateDatabase'],
  'databaseId'
>

type UpdateViewFieldInput = Omit<
  RouterInputs['database']['updateViewField'],
  'viewId' | 'fieldId'
>

export interface IDatabaseContext {
  database: Database
  currentView: DatabaseView

  filterResult: any
  updateRowsIndexes: () => void

  activeViewId: string
  setActiveViewId: (viewId: string) => void
  sortedFields: Field[]

  updateDatabase: (props: UpdateDatabaseInput) => void

  addView(viewType: ViewType): any
  updateView(viewId: string, props: any): Promise<void>
  deleteView(viewId: string): Promise<void>

  updateViewField(fieldId: string, props: any): Promise<void>

  addRecord(): Promise<void>
  deleteRecord(rowId: string): Promise<void>

  addColumn(fieldType: FieldType): Promise<void>
  deleteField(fieldId: string): Promise<void>
  sortFields(fromIndex: number, toIndex: number): Promise<void>

  addSort(viewId: string, fieldId: string, props: Partial<Sort>): Promise<void>
  deleteSort(viewId: string, fieldId: string): Promise<void>

  addGroup(
    viewId: string,
    fieldId: string,
    props: Partial<Group>,
  ): Promise<void>
  deleteGroup(viewId: string, fieldId: string): Promise<void>

  addFilter(
    viewId: string,
    fieldId: string,
    props: Partial<Filter>,
  ): Promise<void>
  deleteFilter(viewId: string, fieldId: string): Promise<void>
  applyFilter(viewId: string, filters: Filter[]): Promise<void>

  updateFilter(
    viewId: string,
    fieldId: string,
    newFieldId: string,
    props?: Partial<Filter>,
  ): Promise<void>

  updateFieldName(fieldId: string, name: string): Promise<void>
  updateColumnWidth(fieldId: string, width: number): Promise<void>
  addOption(fieldId: string, name: string): Promise<Option>
  deleteCellOption(cellId: string, optionId: string): Promise<void>
}

export const DatabaseContext = createContext({} as IDatabaseContext)

export function DatabaseProvider({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const databaseId = params?.get('id')!
  const { isLoading, data } = useQueryDatabase(databaseId)

  // console.log('=====data:', data)

  if (isLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <DatabaseContent database={data as any as Database}>
      {children}
    </DatabaseContent>
  )
}

interface DatabaseContentProps {
  database: Database
}

function DatabaseContent({
  database,
  children,
}: PropsWithChildren<DatabaseContentProps>) {
  const params = useSearchParams()
  const databaseId = params?.get('id')!

  function reloadDatabase(newDatabase: Database) {
    queryClient.setQueriesData(
      { queryKey: ['database', databaseId] },
      newDatabase,
    )
  }

  async function updateDatabase(props: UpdateDatabaseInput) {
    const newDatabase = produce(database, (draft) => {
      if (props.name) draft.name = props.name
      if (props.color) draft.color = props.color
    })

    reloadDatabase(newDatabase)
    await api.database.updateDatabase.mutate({
      ...props,
      databaseId: database.id,
    })
  }

  async function addView(viewType: ViewType) {
    //
  }

  async function updateView(viewId: string, props: any) {}

  async function deleteView(viewId: string) {}

  async function updateViewField(fieldId: string, props: UpdateViewFieldInput) {
    const newDatabase = produce(database, (draft) => {
      for (const view of draft.views) {
        if (view.id === activeViewId) {
          const index = view.viewFields.findIndex((i) => i.fieldId === fieldId)
          if (typeof props.width === 'number') {
            view.viewFields[index].width = props.width
          }
          if (typeof props.visible === 'boolean') {
            view.viewFields[index].visible = props.visible
          }
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateViewField.mutate({
      viewId: currentView.id,
      fieldId,
      ...props,
    })
  }

  async function addRecord() {
    const newFields = database.fields.reduce(
      (acc, field) => {
        return {
          ...acc,
          [field.id]: '',
        }
      },
      {} as Record<string, any>,
    )

    const id = uniqueId()
    const newDatabase = produce(database, (draft) => {
      draft.records.push({
        id,
        databaseId: database.id,
        sort: database.records.length,
        fields: newFields,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DatabaseRecord)
    })

    reloadDatabase(newDatabase)

    await api.database.addRecord.mutate({
      id,
      databaseId: database.id,
      sort: database.records.length,
      fields: newFields,
    })
  }

  async function deleteRecord(recordId: string) {
    const newDatabase = produce(database, (draft) => {
      draft.records = draft.records.filter(
        (record) => record.id !== recordId,
      ) as DatabaseRecord[]
    })

    reloadDatabase(newDatabase)
    await api.database.deleteRecord.mutate(recordId)
  }

  async function addColumn(fieldType: FieldType) {
    const nameMap: Record<string, string> = {
      [FieldType.TEXT]: 'Text',
      [FieldType.NUMBER]: 'Number',
      [FieldType.URL]: 'URL',
      [FieldType.PASSWORD]: 'Password',
      [FieldType.SINGLE_SELECT]: 'Single Select',
      [FieldType.MULTIPLE_SELECT]: 'Multiple Select',
      [FieldType.RATE]: 'Rate',
      [FieldType.MARKDOWN]: 'Markdown',
      [FieldType.DATE]: 'Date',
      [FieldType.CREATED_AT]: 'Created At',
      [FieldType.UPDATED_AT]: 'Updated At',
    }

    const id = uniqueId()
    const name = uniqueId()
    const displayName = nameMap[fieldType] || ''

    const newDatabase = produce(database, (draft) => {
      draft.fields.push({
        id,
        isPrimary: false,
        databaseId: database.id,
        name,
        displayName,
        description: '',
        config: {},
        options: [],
        fieldType,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      for (const view of draft.views) {
        view.viewFields.push({
          fieldId: id,
          width: 160,
          visible: true,
        })
      }

      for (const record of draft.records) {
        record.fields[id] = ''
      }
    })

    reloadDatabase(newDatabase)
    await api.database.addField.mutate({
      id,
      fieldType,
      databaseId: database.id,
      name,
      displayName,
    })
  }

  async function deleteField(fieldId: string) {
    const newDatabase = produce(database, (draft) => {
      draft.fields = draft.fields.filter((field) => field.id !== fieldId)

      for (const view of draft.views) {
        view.viewFields = view.viewFields.filter((i) => i.fieldId !== fieldId)
      }

      for (const record of draft.records) {
        delete record.fields[fieldId]
      }
    })
    reloadDatabase(newDatabase)
    await api.database.deleteField.mutate({
      databaseId: database.id,
      fieldId,
    })
  }

  async function sortFields(fromIndex: number, toIndex: number) {
    const newDatabase = produce(database, (draft) => {
      for (const view of draft.views) {
        if (view.id === activeViewId) {
          view.viewFields = arrayMoveImmutable(
            view.viewFields,
            fromIndex,
            toIndex,
          )
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.sortViewFields.mutate({
      viewId: activeViewId,
      fromIndex,
      toIndex,
    })
  }

  async function updateFieldName(fieldId: string, name: string) {
    const newDatabase = produce(database, (draft) => {
      for (const field of draft.fields) {
        if (field.id === fieldId) {
          field.displayName = name
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateField.mutate({
      fieldId,
      displayName: name,
    })
  }

  async function updateColumnWidth(fieldId: string, width: number) {
    const newDatabase = produce(database, (draft) => {
      for (const view of draft.views) {
        if (view.id === activeViewId) {
          const index = view.viewFields.findIndex((i) => i.fieldId === fieldId)
          view.viewFields[index].width = width
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateViewField.mutate({
      viewId: currentView.id,
      fieldId,
      width,
    })
  }

  async function addOption(fieldId: string, name: string) {
    const id = uniqueId()
    const newOption = {
      id,
      fieldId,
      name,
      color: getRandomColorName(),
    }
    const newDatabase = produce(database, (draft) => {
      for (const field of draft.fields) {
        if (field.id === fieldId) {
          const options = (field.options as Option[]) || []
          field.options = [...options, newOption]
          break
        }
      }
    })

    reloadDatabase(newDatabase)
    api.database.addOption.mutate(newOption)
    return newOption
  }

  async function deleteCellOption(cellId: string, optionId: string) {}

  async function addSort(
    viewId: string,
    fieldId: string,
    props: Partial<Sort>,
  ) {}

  async function deleteSort(viewId: string, fieldId: string) {}

  async function addGroup(
    viewId: string,
    fieldId: string,
    props: Partial<Group>,
  ) {}

  async function deleteGroup(viewId: string, fieldId: string) {}

  async function addFilter(
    viewId: string,
    fieldId: string,
    props: Partial<Filter>,
  ) {}

  async function deleteFilter(viewId: string, fieldId: string) {}

  async function applyFilter(viewId: string, filters: Filter[]) {}

  async function updateFilter(
    viewId: string,
    fieldId: string,
    newFieldId: string,
    props?: Partial<Filter>,
  ) {}
  // console.log('=======database:', database)

  const [activeViewId, setActiveViewId] = useState(() => {
    const view = database.views.find((v) => v.id === database.activeViewId)
    return view?.id || database?.views[0]?.id
  })

  const currentView = useMemo(() => {
    return database.views.find((view) => view.id === activeViewId)!
  }, [database.views, activeViewId])

  const updateRowsIndexes = useCallback(() => {}, [])

  const sortedFields = useMemo(() => {
    if (!currentView) return []
    const viewFields = currentView.viewFields as ViewField[]
    return viewFields.map(({ fieldId }) => {
      return database.fields.find((col) => col.id === fieldId)!
    })
  }, [currentView, database])

  const generateFilter = (databaseId: string): IFilterResult => {
    //
    return {} as any
  }

  return (
    <DatabaseContext.Provider
      value={{
        database,
        filterResult: generateFilter(databaseId),
        updateRowsIndexes,
        currentView: currentView as any, // TODO
        sortedFields,
        activeViewId,
        setActiveViewId,
        updateDatabase,
        addView,
        deleteView,
        updateView,
        updateViewField: updateViewField,
        addRecord,
        deleteRecord,
        addColumn,
        deleteField,
        sortFields,
        updateFieldName,
        updateColumnWidth,
        addOption,
        deleteCellOption,
        addSort,
        deleteSort,
        addGroup,
        deleteGroup,
        addFilter,
        deleteFilter,
        applyFilter,
        updateFilter,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabaseContext() {
  return useContext(DatabaseContext)
}
