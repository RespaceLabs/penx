import { Box } from '@fower/react'
import { LayoutList } from 'lucide-react'
import { Divider, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { useDatabaseContext } from '../../DatabaseContext'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddGroupBtn } from './AddGroupBtn'
import { GroupItem } from './GroupItem'

export const GroupField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  const { groups = [] } = currentView.props

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!groups.length}
          hightLightColor="red"
          icon={<LayoutList size={16} />}
        >
          <Box toCenterY gap1>
            {!!groups.length && <Box> {groups.length} grouped fields</Box>}
            {!groups.length && <Box>Group</Box>}
          </Box>
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent w-300>
        {!groups.length && (
          <Box p3 gray400 textSM>
            No groups applied to this view
          </Box>
        )}

        {!!groups.length && (
          <Box p3 column gap1>
            {groups.map((item) => (
              <GroupItem key={item.columnId} group={item} />
            ))}
          </Box>
        )}

        <Divider />
        <Box p3 toBetween toCenterY>
          <Box gray400 textSM>
            Coming soon
          </Box>
          <AddGroupBtn />
        </Box>
      </PopoverContent>
    </Popover>
  )
}
