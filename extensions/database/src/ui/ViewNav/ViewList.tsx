import { Box } from '@fower/react'
import { useDatabaseContext } from '../DatabaseContext'
import { ViewIcon } from './ViewIcon'
import { ViewMenu } from './ViewMenu'

export const ViewList = () => {
  const { views, viewIndex, setViewIndex } = useDatabaseContext()

  return (
    <Box toCenterY gap1>
      {views.map((view, index) => {
        const active = index === viewIndex
        return (
          <Box
            key={view.id}
            toCenter
            cursorPointer
            rounded
            gray600
            bgGray100--hover
            h-30
            pl3
            gap1
            pr={active ? 4 : 12}
            gray900={active}
            bgGray100={active}
            onClick={() => setViewIndex(index)}
          >
            <ViewIcon viewType={view.props.viewType} />
            <Box>{view.props.name}</Box>
            {active && <ViewMenu view={view} index={index} />}
          </Box>
        )
      })}
    </Box>
  )
}
