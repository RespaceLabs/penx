import { Box } from '@fower/react'
import { CloseButton, Switch } from 'uikit'
import { Group } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'

interface Props {
  group: Group
}

export const GroupItem = ({ group }: Props) => {
  const { currentView, columns, deleteGroup } = useDatabaseContext()

  async function removeGroup(columnId: string) {
    deleteGroup(currentView.id, columnId)
  }

  async function toggleSort(isAscending: boolean) {
    console.log('========isAscending:', isAscending)
  }

  const column = columns.find((col) => col.id === group.columnId)!

  return (
    <Box toBetween key={group.columnId}>
      <Box toCenterY gap1>
        <Box textXS gray400>
          Group by
        </Box>
        <Box textSM>{column?.props.name}</Box>
      </Box>
      <Box toCenterY gap2>
        <Box toCenterY textXS gray400 gap1>
          <Switch
            size={12}
            checked={group.isAscending}
            onChange={(e) => toggleSort(e.target.checked)}
          >
            Ascending
          </Switch>
        </Box>
        <CloseButton size={20} onClick={() => removeGroup(group.columnId)} />
      </Box>
    </Box>
  )
}
