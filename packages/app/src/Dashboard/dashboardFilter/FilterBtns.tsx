import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, usePopoverContext } from 'uikit'
import { TableSearch } from '@penx/database-ui'
import { Filter, INode, ISpace } from '@penx/model-types'

interface IFilterBtns {
  filters: Filter[]
  activeSpace: ISpace
  addFilter: () => void
  setFiltersDb: (filters: Filter[]) => void
  setSpaceNodes: (nodes: INode[]) => void
  spaceNodes: INode[]
}

export const FilterBtns = ({
  filters,
  activeSpace,
  setFiltersDb,
  addFilter,
  spaceNodes,
  setSpaceNodes,
}: IFilterBtns) => {
  const { close } = usePopoverContext()

  const applyFilter = () => {
    setFiltersDb(filters)
    const searchInstance = TableSearch.getInstance()
    const dataSourceMap = searchInstance.dataSourceMap.get(activeSpace.id)
    if (!dataSourceMap) {
      return
    }

    if (filters.length) {
      const { rowKeys } = searchInstance.search(filters, activeSpace.id)
      const newNodes: INode[] = []
      rowKeys.forEach((rowKey) => {
        const node = dataSourceMap?.get(rowKey)
        if (node) {
          newNodes.push(node)
        }
      })

      setSpaceNodes(newNodes)
    } else {
      setSpaceNodes(Array.from(dataSourceMap.values()))
    }
  }

  async function onApplyFilter() {
    applyFilter()
    close()
  }

  return (
    <>
      <Button
        size="sm"
        variant="light"
        colorScheme="gray500"
        onClick={addFilter}
      >
        <Plus size={16} />
        <Box>Add filter</Box>
      </Button>
      <Box gray400 textSM>
        <Button
          size="sm"
          variant="light"
          colorScheme="gray500"
          onClick={onApplyFilter}
        >
          Apply filter
        </Button>
      </Box>
    </>
  )
}
