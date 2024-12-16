import { CatalogueTree } from '@/lib/catalogue'
import { IRootNode } from '@/lib/model'
import { useNodes } from './useNodes'

export function useCatalogue() {
  const { nodeList } = useNodes()
  const rootNode = nodeList.rootNode.raw as IRootNode

  const catalogueTree = CatalogueTree.fromJSON(rootNode?.props?.catalogue || [])
  return catalogueTree
}
