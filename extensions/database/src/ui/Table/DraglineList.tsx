import { DatabaseElement } from '../../types'
import { DraglineItem } from './DraglineItem'

export const DraglineList = ({ element }: { element: DatabaseElement }) => {
  const { colWidths = [] } = element
  return (
    <>
      {colWidths.map((width, i) => {
        return (
          <DraglineItem
            key={i}
            id={element.id!}
            width={width}
            colWidths={colWidths}
            index={i}
          />
        )
      })}
    </>
  )
}
