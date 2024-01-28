import { useContext, useState } from 'react'
import { useDatabaseContext } from '@penx/database/src/ui/DatabaseContext'
import {
  ConjunctionType,
  Filter,
  OperatorType,
} from '@penx/model-types/src/interfaces/INode'
import { SpacesContext } from '..'

export function useFilterField() {
  const { currentView } = useDatabaseContext()
  const { viewColumns } = useContext(SpacesContext)
  const [filters, setFilters] = useState<Filter[]>([])

  // TODO: filtering is not persisted
  // const { filters: filtersDb = [], } = { filters: [] }

  const addFilter = () => {
    const viewColumn = viewColumns.find(
      (c) => !filters.map((i) => i.columnId).includes(c.name),
    )!

    if (viewColumn) {
      setFilters([
        ...filters,
        {
          operator: OperatorType.EQUAL,
          columnId: viewColumn.name,
          conjunction: ConjunctionType.AND,
          value: '',
        },
      ])
    }
  }

  const updateFilter = (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => {
    const filterIndex = filters.findIndex((item) => item.columnId === columnId)
    if (filterIndex >= 0) {
      filters[filterIndex] = {
        ...filters[filterIndex],
        columnId: newColumnId,
        ...props,
      } as Filter
    }

    setFilters([...filters])
  }

  const deleteFilter = (columnId: string) => {
    setFilters(filters.filter((s) => s.columnId !== columnId))
  }

  return {
    filters,
    currentView,
    setFilters,
    addFilter,
    deleteFilter,
    updateFilter,
  }
}
