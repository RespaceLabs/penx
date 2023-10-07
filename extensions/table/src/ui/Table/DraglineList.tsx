import { TableElement } from '../../types'
import { DraglineItem } from './DraglineItem'

export const DraglineList = ({ element }: { element: TableElement }) => {
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
