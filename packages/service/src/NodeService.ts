import _ from 'lodash'
import { createEditor, Editor } from 'slate'
import { ELEMENT_TITLE } from '@penx/constants'
import { getNodeByPath } from '@penx/editor-queries'
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_UL,
  isListContentElement,
  isListItemElement,
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

  get markdownContent() {
    // return slateToMarkdown(this.doc.content)
    return ''
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

    let node = this.node
    let i = 0
    while (this.node.parentId) {
      for (const item of this.allNodes) {
        if (node.parentId === item.id) {
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

    await this.saveNodes(title, ul)

    const nodes = await db.listNormalNodes(this.spaceId)

    store.setNodes(nodes)
    store.setNode(node!)
  }

  saveNodes = async (title: TitleElement, ul: UnorderedListElement) => {
    const editor = createEditor()
    editor.insertNodes(ul)

    const childrenForCurrentNode = ul.children.map((listItem) => {
      return listItem.children[0].id
    })

    // update root node's children
    await db.updateNode(this.node.id, {
      children: childrenForCurrentNode,
    })

    const listContents = Editor.nodes(editor, {
      at: [],
      match: isListContentElement,
    })

    for (const [item, path] of listContents) {
      const parent = getNodeByPath(
        editor,
        path.slice(0, -1),
      ) as any as ListItemElement

      // get node children
      let children: string[] = []

      if (parent.children.length > 1) {
        const listItems = parent.children[1]
          .children as any as ListItemElement[]
        children = listItems.map((item) => {
          return item.children[0].id
        })
      }

      // node parentId
      let parentId = title.id
      const grandparent = getNodeByPath(editor, path.slice(0, -3))!

      if (isListItemElement(grandparent)) {
        parentId = grandparent.children[0].id
        console.log('parentId:', parentId, grandparent.children[0])
      }

      const element = item.children[0]
      const node = await db.getNode(item.id)

      if (node) {
        await db.updateNode(item.id, {
          parentId,
          element,
          collapsed: !!item.collapsed,
          children,
        })
      } else {
        await db.createNode({
          id: item.id,
          parentId,
          spaceId: this.spaceId,
          collapsed: !!item.collapsed,
          element,
          children,
        })
      }
    }
  }
}
