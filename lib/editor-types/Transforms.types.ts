import { Location, Node, Path, Point, Range } from 'slate'
import { MatchOptions } from './Editor.types'

export type TNodeMatch<T extends Node = Node> =
  | ((node: Node, path: Path) => node is T)
  | ((node: Node, path: Path) => boolean)

export interface WrapOptions<T extends Node = Node> extends MatchOptions<T> {
  at?: Path | Point | Range
  mode?: 'highest' | 'lowest' | 'all'
  split?: boolean
  voids?: boolean
}

export interface InsertNodesOptions<T extends Node = Node>
  extends MatchOptions<T> {
  at?: Path | Point | Range
  mode?: 'highest' | 'lowest'
  hanging?: boolean
  select?: boolean
  voids?: boolean
}

export interface SetNodesOptions<T extends Node = Node> {
  at?: Location
  match?: TNodeMatch<T>
  mode?: 'all' | 'highest' | 'lowest'
  hanging?: boolean
  split?: boolean
  voids?: boolean
}
