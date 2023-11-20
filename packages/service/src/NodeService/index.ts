import _ from 'lodash'
import { createEditor, Editor, Node as SlateNode, Transforms } from 'slate'
import { ELEMENT_TITLE } from '@penx/constants'
import { extractTags } from '@penx/editor-common'
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
import { db, emitter } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, NodeType } from '@penx/model-types'
import { store } from '@penx/store'
import { NodeCleaner } from '../NodeCleaner'
import { getDatabaseNodeEditorValue } from './getDatabaseNodeEditorValue'
import { getDatabaseRootEditorValue } from './getDatabaseRootEditorValue'

export class NodeService {
  nodeMap = new Map<string, INode>()

  childrenNodes: Node[] = []

  constructor(
    private node: Node,
    public allNodes: Node[],
  ) {
    if (node?.raw) {
      for (const item of allNodes) {
        this.nodeMap.set(item.id, item.raw)
      }

      this.childrenNodes = node.raw.children.map((id) => {
        return new Node(this.nodeMap.get(id)!)
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

  get parentNode() {
    const node = this.nodeMap.get(this.node.parentId)
    return node ? new Node(node) : null
  }

  isEqual(node: Node) {
    return node.id === this.node.id
  }

  getEditorValue(
    childrenNodes: Node[] = this.childrenNodes,
    isCreateTitle = true,
  ) {
    if (this.node.isDatabase) {
      return getDatabaseNodeEditorValue(this.node)
    }

    if (this.node.isDatabaseRoot) {
      return getDatabaseRootEditorValue(this.node, this.nodeMap)
    }

    const childrenToList = (
      children: string[],
      parentId: string | null = null,
    ) => {
      const listItems = children.map((id) => {
        const node = this.nodeMap.get(id)!

        const children = [
          {
            id: node.id,
            type: ELEMENT_LIC,
            nodeType: node.type,
            parentId,
            collapsed: node.collapsed,
            children: Array.isArray(node.element)
              ? node.element
              : [node.element],
          },
        ]

        if (node.children) {
          const ul = childrenToList(node.children, node.id)
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
      children: childrenNodes.map((node) => {
        // override the title
        if (node.isDaily || node.isInbox) {
          node.element[0].children[0].text = node.title
        }

        const listChildren = [
          {
            id: node.id,
            type: ELEMENT_LIC,
            parentId: null,
            nodeType: node.type,
            props: node.props,
            collapsed: node.collapsed,
            children: Array.isArray(node.element)
              ? node.element
              : [node.element],
          },
        ]

        const ul = childrenToList(node.children, node.id) as any
        if (ul) listChildren.push(ul)

        return {
          type: ELEMENT_LI,
          children: listChildren,
        }
      }),
    }

    // override the title
    if (
      this.node.isDaily ||
      this.node.isDailyRoot ||
      this.node.isInbox ||
      this.node.isTrash
    ) {
      this.node.element[0].children[0].text = this.node.title
    }

    const value: any[] = []

    if (isCreateTitle) {
      value.push({
        id: this.node.id,
        type: ELEMENT_TITLE,
        props: this.node.props,
        nodeType: this.node.type,
        children: Array.isArray(this.node.element)
          ? this.node.element
          : [this.node.element],
      })
    }

    if (childrenNodes.length) {
      value.push(content)
    }

    return value
  }

  // TODO: improve performance
  getParentNodes(): Node[] {
    const parentNodes: Node[] = [this.node]

    let node = this.node
    let i = 0
    while (this.node.parentId) {
      for (const item of this.allNodes) {
        if (node.parentId === item.id) {
          node = item
          if (node.type !== NodeType.ROOT) {
            parentNodes.unshift(item)
          }
        }
      }

      i++

      // fallback, if have some bug, break it forced
      if (i > 1000) break
    }

    return parentNodes
  }

  async selectNode(node?: Node) {
    store.selectNode(node?.raw || this.node.raw)
  }

  async toggleFolded(id: string, folded: boolean) {
    await db.updateNode(id, {
      folded: !folded,
    })

    const nodes = await db.listNodesBySpaceId(this.spaceId)

    store.setNodes(nodes)
  }

  savePage = async (
    node: INode,
    title: TitleElement,
    ul?: UnorderedListElement,
    isInReference = false,
  ) => {
    if (title) {
      node = await db.updateNode(node.id, {
        element: title.children,
      })

      // update space name
      if (this.node.isRootNode) {
        await store.updateSpace(node.spaceId, {
          name: SlateNode.string(title),
        })
      }
    }

    if (ul) {
      await this.saveNodes(node.id, ul)
    }

    const nodes = await db.listNormalNodes(this.spaceId)

    store.setNodes(nodes)

    if (!isInReference) {
      store.setNode(node)
    }

    // update snapshot
    const nodeService = new NodeService(
      new Node(node!),
      nodes.map((n) => new Node(n)),
    )

    const [rootNode] = nodeService.getParentNodes()
    const childrenNodes = rootNode.children.map(
      (id) => new Node(nodeService.nodeMap.get(id)!),
    )

    // update page snapshot
    const value = nodeService.getEditorValue(childrenNodes)

    await db.updateSnapshot(rootNode.raw, 'update', value)

    await new NodeCleaner().cleanDeletedNodes()
  }

  saveNodes = async (parentId: string, ul: UnorderedListElement) => {
    const editor = createEditor()
    Transforms.insertNodes(editor, ul)

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
      const grandparent = getNodeByPath(editor, path.slice(0, -3))!

      let newParentId = parentId

      if (isListItemElement(grandparent)) {
        newParentId = grandparent.children[0].id
      }

      const key = [...path.slice(1)].reduce(
        (acc, cur) => [...acc, 'children', cur],
        [] as any[],
      )

      const element = _.get(ul, [...key, 'children'])

      const node = await db.getNode(item.id)

      const tags = extractTags(element)

      // console.log('=======tags:', tags, element)

      if (node) {
        const node = await db.updateNode(item.id, {
          parentId: newParentId,
          element,
          collapsed: !!item.collapsed,
          children,
        })

        for (const tagName of tags) {
          await db.createTagRow(tagName, node.id)
        }

        if (tags.length) {
          emitter.emit('REF_NODE_UPDATED', node)
        }
      } else {
        await db.createNode({
          id: item.id,
          parentId: newParentId,
          spaceId: this.spaceId,
          collapsed: !!item.collapsed,
          element,
          children,
        })
      }
    }
  }
}
