import { Box } from '@fower/react'
import { useDatabaseContext } from './DatabaseContext'

export const ViewList = () => {
  const { views, viewIndex, setViewIndex } = useDatabaseContext()

  return (
    <Box flex-1 toLeft gap1 mb2>
      {views.map((view, index) => (
        <Box
          key={view.id}
          cursorPointer
          rounded
          gray600
          gray900={index === viewIndex}
          bgGray100={index === viewIndex}
          bgGray100--hover
          h-28
          px3
          toCenter
          onClick={() => setViewIndex(index)}
        >
          {view.props.name}
        </Box>
      ))}
    </Box>
  )
}
