import type { MutableRefObject } from 'react'
import { INode } from '@penx/model-types'

export interface TreeItem extends Omit<INode, 'children'> {
  children: TreeItem[]
}

export type TreeItems = TreeItem[]

export interface FlattenedItem extends TreeItem {
  parentId: string
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
