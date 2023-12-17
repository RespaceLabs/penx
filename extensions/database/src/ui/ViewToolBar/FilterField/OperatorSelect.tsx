import { Box } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { Menu, MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { Filter, OperatorType } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'

interface FieldSelectProps {
  filter: Filter
  index: number
}

export function OperatorSelect({ index, filter }: FieldSelectProps) {
  const { currentView } = useDatabaseContext()

  function onSelectOperator(operator: OperatorType) {
    //
  }

  return (
    <Popover>
      <PopoverTrigger>
        {({ isOpen }) => (
          <Box
            toBetween
            toCenterY
            border
            borderNeutral200
            bgGray100--hover
            px2
            h-34
            w-120
            roundedLG
            textSM
          >
            <Box>{filter.operator}</Box>
            <ChevronDown size={16} />
          </Box>
        )}
      </PopoverTrigger>
      <PopoverContent>
        {({ close }) => (
          <Menu w-120>
            {Object.keys(OperatorType).map((type) => (
              <MenuItem
                key={type}
                toBetween
                selected={type === filter.operator}
                onClick={() => {
                  onSelectOperator(type as any)
                  close()
                }}
              >
                <Box>{type}</Box>
              </MenuItem>
            ))}
          </Menu>
        )}
      </PopoverContent>
    </Popover>
  )
}
