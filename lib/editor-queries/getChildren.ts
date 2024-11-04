import { Ancestor, Descendant, NodeEntry, Path } from 'slate'

/**
 * Get children node entries of a node entry.
 * TODO: try Node.children
 */
export const getChildren = <T extends Descendant | Ancestor>(
  nodeEntry: NodeEntry<T>,
) => {
  const [node, path] = nodeEntry

  const children: any[] = (node as any).children || []

  return children.map((child, index) => {
    const childPath: Path = path.concat([index])
    return [child, childPath] as NodeEntry<Descendant>
  })
}
