import { Button } from '@/components/ui/button'
import { useDatabaseContext } from '@/lib/database-context'
import { Filter, IViewNode, ViewColumn } from '@/lib/model'

import { Plus } from 'lucide-react'

interface IFilterBtns {
  filters: Filter[]
  viewColumns: ViewColumn[]
  currentView: IViewNode
  addFilter: () => void
}

export const FilterBtns = ({
  addFilter,
  currentView,
  filters,
}: IFilterBtns) => {
  const { applyFilter } = useDatabaseContext()

  async function onApplyFilter() {
    await applyFilter(currentView.id, filters)
  }

  return (
    <>
      <Button size="sm" onClick={addFilter}>
        <Plus size={16} />
        <div>Add filter</div>
      </Button>
      <div className="text-foreground/40 text-sm">
        <Button size="sm" onClick={onApplyFilter}>
          Apply filter
        </Button>
      </div>
    </>
  )
}
