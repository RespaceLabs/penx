import { CatalogueTree } from '@penx/catalogue'
import { Node } from '@penx/model'
import { IRootNode } from '@penx/model-types'
import { useNodes } from './useNodes'

export function useCatalogue() {
  const { nodeList } = useNodes()
  const rootNode = nodeList.rootNode.raw as IRootNode

  const catalogueTree = CatalogueTree.fromJSON(rootNode?.props?.catalogue || [])
  return catalogueTree
}
