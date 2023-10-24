import _ from 'lodash'
import { ELEMENT_TITLE } from '@penx/constants'
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_UL,
  isListContentElement,
  ListContentElement,
  ListItemElement,
  TitleElement,
  UnorderedListElement,
} from '@penx/list'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { store } from '@penx/store'
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

  getEditorValue() {
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

    const content = {
      type: ELEMENT_UL,
      children: this.pageNodes.map((node) => {
        // console.log('node-----------:', node)

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
    }

    const value: any[] = [
      {
        id: this.node.id,
        type: ELEMENT_TITLE,
        children: [this.node.element],
      },
    ]

    if (this.pageNodes.length) {
      value.push(content)
    }

    return value
  }

  getParentNodes(): Node[] {
    const parentNodes: Node[] = [this.node]
    const space = store.getActiveSpace()

    let node = this.node
    const isRoot = (id: string) => space.children.includes(id)
    let i = 0
    while (!isRoot(node.id)) {
      for (const item of this.allNodes) {
        if (item.children.includes(node.id)) {
          node = item
          parentNodes.unshift(item)
        }
      }

      i++

      // fallback, if have some bug, break it forced
      if (i > 1000) break
    }

    return parentNodes
  }

  async selectNode(node?: Node) {
    store.routeTo('NODE')
    store.reloadNode(node?.raw || this.node.raw)
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
    const node = await db.updateNode(title.id!, {
      element: title.children[0],
    })

    await this.saveNodes(ul.children)

    const nodes = await db.listNormalNodes(this.spaceId)

    store.setNodes(nodes)
    store.setNode(node!)
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
