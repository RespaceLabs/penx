import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDatabaseContext } from '@/lib/database-context'
import { db } from '@/lib/local-db'
import { IRowNode } from '@/lib/model'
import { cn } from '@/lib/utils'

interface Tag {
  text: string
}

interface TagContainer {
  type: 'tag'
  children: Tag[]
  trigger: string
  isOpen: boolean
  name: string
  databaseId: string
  text?: string
}

interface Paragraph {
  type: string
  children: TagContainer[]
}

interface GalleryViewProps {}

const itemWidth = 267

export const GalleryView = ({
  children,
}: PropsWithChildren<GalleryViewProps>) => {
  const { rows } = useDatabaseContext()
  const [columnCount, setColumnCount] = useState(2)

  const calculateColumnCount = () => {
    const containerWidth =
      window.document.getElementById('gallery-container')?.offsetWidth || 600
    const minColumnCount = 1
    const newColumnCount = Math.max(
      minColumnCount,
      Math.floor(containerWidth / itemWidth),
    )

    setColumnCount(newColumnCount)
  }

  useEffect(() => {
    calculateColumnCount()
    window.addEventListener('resize', calculateColumnCount)

    return () => {
      window.removeEventListener('resize', calculateColumnCount)
    }
  }, [])

  return (
    <div className="relative bg-green-500 w-full" id="gallery-container">
      {rows.map((row, index) => (
        <GalleryItem
          key={row.id}
          row={row}
          index={index}
          columnCount={columnCount}
        />
      ))}
    </div>
  )
}

interface GalleryItemProps {
  row: IRowNode
  index: number
  columnCount: number
}

function GalleryItem({ row, index, columnCount }: GalleryItemProps) {
  const [nodeElement, setNodeElement] = useState<Paragraph[]>([])
  const { cells } = useDatabaseContext()

  const primaryCell = cells.find(
    (cell) => !!cell.props.ref && cell.props.rowId === row.id,
  )!

  const nodeId = primaryCell.props.ref

  useEffect(() => {
    db.getNode(nodeId).then((node) => {
      if (!node) {
        return setNodeElement([])
      }

      setNodeElement(node.element)
    })
  }, [nodeId])

  const calculatePosition = useMemo(
    () => (index: number) => {
      const margin = 20
      const itemWidth = 267
      const itemHeight = 168
      const col = index % columnCount
      const row = Math.floor(index / columnCount)
      const left = col * (itemWidth + margin)
      const top = row * (itemHeight + margin)

      return { left, top }
    },
    [columnCount],
  )

  const element = (
    nodeElement?.length >= 1 ? nodeElement[0] : nodeElement
  ) as Paragraph
  if (element?.type === 'p') {
    const children = element?.children ? element?.children[0] : null
    const { left, top } = calculatePosition(index)
    return (
      <div
        key={children?.databaseId}
        className={cn(
          'absolute w-[267px] h-[168px] box-border rounded-md border border-foreground/5 hover:shadow-lg bg-background',
        )}
        style={{ left, top }}
      >
        <div className="p-4">{children?.text}</div>
      </div>
    )
  }

  return null
}
