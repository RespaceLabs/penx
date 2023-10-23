import _ from 'lodash'
import { ListContentElement, ListItemElement } from '@penx/list'
import { isListContentElement } from '@penx/list/src/guard'
import { db } from '@penx/local-db'
import { Node, Page } from '@penx/model'
import { NodeService } from './NodeService'

export class PageService {
  get nodeService() {
    return new NodeService(new Node(this.page.node))
  }

  constructor(public page: Page) {}

  saveNodes = async (
    nodes: (ListItemElement | ListContentElement)[],
    parent?: any,
  ) => {
    if (!nodes.length) return

    if (!parent) {
      // update root node children
      const newIdsFromActiveNode = nodes.map((listItem) => {
        return (listItem as any).children[0].id
      })
      await db.updateNode(this.page.node.id, {
        children: newIdsFromActiveNode,
      })
    }

    for (const item of nodes) {
      if (isListContentElement(item)) {
        const element = item.children[0]
        const node = await db.getNode(item.id)

        let children: string[] = []

        if (parent.children.length > 1) {
          const listItems = parent.children[1]
            .children as any as ListItemElement[]

          children = listItems.map((item) => {
            return item.children[0].id
          })
        }

        if (node) {
          await db.updateNode(item.id, {
            element,
            collapsed: !!item.collapsed,
            children,
          })
        } else {
          await db.createNode({
            spaceId: this.page.spaceId,
            id: item.id,
            collapsed: !!item.collapsed,
            element,
            children,
          })
        }
        continue
      }

      if (item.children?.length) {
        await this.saveNodes(item.children as any, item)
      }
    }
  }
}
