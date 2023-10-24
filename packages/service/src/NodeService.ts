import _ from 'lodash'
import { ELEMENT_TITLE } from '@penx/constants'
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_UL,
  isListContentElement,
  ListContentElement,
  ListItemElement,
  UnorderedListElement,
} from '@penx/list'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { store } from '@penx/store'
import { TitleElement } from '@penx/title'
import { INode } from '@penx/types'

export class NodeService {
  nodeMap = new Map<string, INode>()

  pageNodes: Node[] = []

  constructor(
    private node: Node,
    public allNodes: Node[],
  ) {
    if (node?.raw) {
      for (const node of allNodes) {
        this.nodeMap.set(node.id, node.raw)
      }

      this.pageNodes = node.raw.children.map((id) => {
        // TODO: improve performance
        return allNodes.find((n) => n.id === id)!
      })
    }
  }

  get spaceId() {
    return this.node.spaceId
  }

  get editorValue() {
    const childrenToList = (children: string[]) => {
      const listItems = children
        .filter((id) => this.nodeMap.get(id))
        .map((id) => {
          const node = this.nodeMap.get(id)!

          const children = [
            {
              id: node.id,
              type: ELEMENT_LIC,
              collapsed: node.collapsed,
              children: [node.element],
            },
          ]

          if (node.children) {
            const ul = childrenToList(node.children)
            if (ul) children.push(ul as any)
          }

          return {
            type: ELEMENT_LI,
            children,
          }
        })

      if (!listItems.length) return null
      return {
        type: ELEMENT_UL,
        children: listItems,
      }
    }

    const value = [
      {
        id: this.node.id,
        type: ELEMENT_TITLE,
        children: [this.node.element],
      },
      {
        type: ELEMENT_UL,
        children: this.pageNodes.map((node) => {
          const listChildren = [
            {
              id: node.id,
              type: ELEMENT_LIC,
              collapsed: node.collapsed,
              children: [node.element],
            },
          ]

          const ul = childrenToList(node.children) as any
          if (ul) listChildren.push(ul)

          return {
            type: ELEMENT_LI,
            children: listChildren,
          }
        }),
      },
    ]

    return value
  }

  async selectNode() {
    // TODO: improve performance
    const nodes = await db.listNormalNodes(this.spaceId)
    store.routeTo('NODE')
    store.reloadNode(this.node.raw)
  }

  async addToFavorites() {
    const space = store.getActiveSpace()

    await db.updateSpace(this.spaceId, {
      favorites: [...space.favorites, this.node.id],
    })

    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }

  async removeFromFavorites() {
    const space = store.getActiveSpace()

    const favorites = space.favorites.filter((id) => id !== this.node.id)
    await db.updateSpace(this.spaceId, { favorites })

    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }

  isFavorite() {
    const space = store.getActiveSpace()
    return space.favorites.includes(this.node.id)
  }

  savePage = async (title: TitleElement, ul: UnorderedListElement) => {
    await db.updateNode(title.id!, {
      element: title.children[0],
    })

    await this.saveNodes(ul.children)
  }

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
      await db.updateNode(this.node.id, {
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
            spaceId: this.spaceId,
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
