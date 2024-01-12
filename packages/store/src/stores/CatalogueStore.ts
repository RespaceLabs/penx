import { CatalogueTree } from '@penx/catalogue'
import { db } from '@penx/local-db'
import { CatalogueNodeType } from '@penx/model-types'
import { StoreType } from '../store-types'

export class CatalogueStore {
  constructor(private store: StoreType) {}

  addNode = async (type: CatalogueNodeType, parentId = '') => {
    const space = this.store.space.getActiveSpace()
    const node = await db.createPageNode(
      {
        collapsed: true,
        spaceId: space.id,
      },
      space,
    )
    const rootNode = this.store.node.getRootNode()
    const catalogue = rootNode?.props?.catalogue || []

    const tree = CatalogueTree.fromJSON(catalogue)

    tree.addNode(
      {
        id: node.id,
        folded: false,
        type,
        children: [],
      },
      parentId,
    )

    await db.updateNode(rootNode.id, {
      props: {
        ...rootNode.props,
        catalogue: tree.toJSON(),
      },
    })

    const nodes = await db.listNodesBySpaceId(space.id)

    this.store.node.setNodes(nodes)
    this.store.node.selectNode(node)
  }

  deleteNode = async (id: string) => {
    const rootNode = this.store.node.getRootNode()
    const tree = CatalogueTree.fromJSON(rootNode?.props?.catalogue)
    tree.deleteNode(id)

    await db.updateNode(rootNode.id, {
      props: {
        catalogue: tree.toJSON(),
      },
    })

    await this.store.node.deleteNode(id)
  }
}
