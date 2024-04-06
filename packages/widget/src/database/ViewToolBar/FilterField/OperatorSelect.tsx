import { Box } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { Menu, MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { Filter, OperatorType } from '@penx/model-types'

interface FieldSelectProps {
  filter: Filter
  updateFilter: (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => void
}

export function OperatorSelect({ filter, updateFilter }: FieldSelectProps) {
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
                  updateFilter(filter.columnId, filter.columnId, {
                    operator: type as OperatorType,
                  })
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
