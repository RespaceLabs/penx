import { Ancestor, Location, Node, Path, Point, Range } from 'slate'
import { Predicate } from './match'

export type NodeMatch<T = Node> = Predicate<T>

export interface MatchOptions<T = Node> {
  match?: NodeMatch<T>
  block?: boolean
}

export interface EditorNodesOptions<T = Node> extends MatchOptions<T> {
  at?: Location
  mode?: 'highest' | 'lowest' | 'all'
  universal?: boolean
  reverse?: boolean
  voids?: boolean
}

export interface EditorAboveOptions<T = Ancestor> extends MatchOptions<T> {
  at?: Range | Path | Point
  mode?: 'highest' | 'lowest'
  voids?: boolean
}

export interface EditorParentOptions {
  depth?: number | undefined
  edge?: 'start' | 'end' | undefined
}
