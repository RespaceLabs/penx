import isEqual from 'react-fast-compare'
import _ from 'lodash'
import { createEditor, Editor, Node as SlateNode, Transforms } from 'slate'
import { extractTags } from '@penx/editor-common'
import { getNodeByPath } from '@penx/editor-queries'
import {
  isListContentElement,
  isListElement,
  isListItemElement,
  ListItemElement,
  TitleElement,
  UnorderedListElement,
} from '@penx/list'
import { db, emitter } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, NodeType } from '@penx/model-types'
import { store } from '@penx/store'
import { NodeCleaner } from './NodeCleaner'

export class NodeService {
  nodeMap = new Map<string, INode>()

  childrenNodes: Node[] = []

  private date: string

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

    const parentNodes = this.getParentNodes()

    if (parentNodes.length > 1 && parentNodes[0].isDailyRoot) {
      const dateNode = parentNodes[1]
      if (dateNode) {
        this.date = dateNode.date || ''
      }
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
    store.node.selectNode(node?.raw || this.node.raw)
  }

  async toggleFolded(id: string, folded: boolean) {
    await db.updateNode(id, {
      folded: !folded,
    })

    const nodes = await db.listNodesBySpaceId(this.spaceId)

    store.node.setNodes(nodes)
  }

  private async saveTitle(node: INode, title: TitleElement) {
    if (!title) return

    if (this.node.isDatabase) {
      if (!this.node.isTodoDatabase) {
        node = await db.updateNode(node.id, {
          props: {
            ...node.props,
            name: SlateNode.string(title),
          },
        })
      }
    } else {
      const oldHash = new Node(node).toHash()
      const newHash = new Node({ ...node, element: title.children }).toHash()

      if (oldHash !== newHash) {
        console.log('==title==oldHash:', oldHash)

        node = await db.updateNode(node.id, {
          element: title.children,
          date: this.date,
        })
      }
    }

    // update space name
    if (this.node.isRootNode) {
      await store.space.updateSpace(node.spaceId, {
        name: SlateNode.string(title),
      })
    }
  }

  saveBlockEditor = async (
    node: INode,
    value: any[] = [],
    isInReference = false,
  ) => {
    const [title, ...elements] = value
    await this.saveTitle(node, title)

    if (this.node.isDatabase || this.node.isDatabaseRoot) {
      return
    }

    await this.saveBlockNodes(node.id, elements)

    await new NodeCleaner().cleanDeletedNodes()

    const nodes = await db.listNodesBySpaceId(this.spaceId)

    store.node.setNodes(nodes)

    if (!isInReference) {
      const newNode = nodes.find((item) => item.id === node.id)!
      store.node.setFirstActiveNodes(newNode)
    }

    await store.sync.pushToCloud()
  }

  saveOutlinerEditor = async (
    node: INode,
    title: TitleElement,
    ul?: UnorderedListElement,
    isInReference = false,
  ) => {
    await this.saveTitle(node, title)

    if (ul && !this.node.isDatabase && !this.node.isDatabaseRoot) {
      await this.saveOutlinerNodes(node.id, ul)
    }

    await new NodeCleaner().cleanDeletedNodes()

    const nodes = await db.listNodesBySpaceId(this.spaceId)

    store.node.setNodes(nodes)

    if (!isInReference) {
      store.node.setFirstActiveNodes(node)
    }

    await store.sync.pushToCloud()
  }

  saveBlockNodes = async (parentId: string, elements: any[]) => {
    const nodeChildren = elements.map((n) => n.id)
    if (!isEqual(this.node.children, nodeChildren)) {
      await db.updateNode(this.node.id, {
        children: nodeChildren,
      })
    }

    for (const item of elements) {
      const node = await db.getNode(item.id)

      const tags = extractTags([item])

      const isList = isListElement(item)

      if (node) {
        const oldHash = new Node(node).toHash()
        const newHash = new Node({
          ...node,
          element: [item],
        }).toHash()

        if (oldHash !== newHash) {
          const newNode = await db.updateNode(item.id, {
            element: [item],
            children: [], // TODO:
            date: this.date,
          })

          const node = new Node(newNode)
          if (node.isTodoElement) {
            const nodeService = new NodeService(node, this.allNodes)

            let sourceId = ''

            const parentNodes = nodeService.getParentNodes()
            if (parentNodes.length) {
              if (parentNodes[0].isDailyRoot) {
                sourceId = parentNodes[1].id
              } else {
                sourceId = parentNodes[0].id
              }
            }

            await db.createTodoRow(node.id, sourceId)
          }

          for (const tagName of tags) {
            await db.createTagRow(tagName, newNode.id)
          }

          if (tags.length) {
            emitter.emit('REF_NODE_UPDATED', newNode)
          }
        }

        if (isList) {
          await this.saveOutlinerNodes(item.id, item as any, false)
        }
      } else {
        let newNode: INode
        if (isList) {
          newNode = await db.createNode({
            id: item.id,
            parentId,
            type: NodeType.LIST,
            spaceId: this.spaceId,
            element: [item],
            children: [], // TODO:
            date: this.date,
          })

          await this.saveOutlinerNodes(item.id, item as any, false)
        } else {
          newNode = await db.createNode({
            id: item.id,
            parentId,
            spaceId: this.spaceId,
            element: [item],
            children: [], // TODO:
            date: this.date,
          })
        }

        const node = new Node(newNode)

        if (node.isTodoElement) {
          const nodeService = new NodeService(node, this.allNodes)
          const parentNodes = nodeService.getParentNodes()

          let sourceId = ''
          if (parentNodes.length) {
            if (parentNodes[0].isDailyRoot) {
              sourceId = parentNodes[1].id
            } else {
              sourceId = parentNodes[0].id
            }
          }

          await db.createTodoRow(node.id, sourceId)
        }

        for (const tagName of tags) {
          await db.createTagRow(tagName, newNode.id)
        }
      }
    }
  }

  saveOutlinerNodes = async (
    parentId: string,
    ul: UnorderedListElement,
    isOutliner = true,
  ) => {
    const editor = createEditor()
    Transforms.insertNodes(editor, ul)

    const childrenForCurrentNode = ul.children.map((listItem) => {
      return listItem.children[0].id
    })

    const parentNode = await db.getNode(parentId)
    if (!isEqual(parentNode?.children, childrenForCurrentNode)) {
      // update root node's children
      await db.updateNode(parentId, {
        children: childrenForCurrentNode,
        date: this.date,
      })
    }

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

        children = listItems.map((item) => item.children[0].id)
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
        const oldHash = new Node(node).toHash()
        const newHash = new Node({
          ...node,
          parentId: newParentId,
          element,
          collapsed: !!item.collapsed,
          children,
        }).toHash()

        if (oldHash !== newHash) {
          const updateData: Partial<INode> = {
            // type: isOutliner ? NodeType.COMMON : NodeType.LIST_ITEM,
            parentId: newParentId,
            element,
            collapsed: !!item.collapsed,
            children,
            date: this.date,
          }

          const newNode = await db.updateNode(item.id, updateData)

          const node = new Node(newNode)

          if (node.isTodoElement) {
            const nodeService = new NodeService(node, this.allNodes)

            let sourceId = ''
            const parentNodes = nodeService.getParentNodes()
            if (parentNodes.length) {
              if (parentNodes[0].isDailyRoot) {
                sourceId = parentNodes[1].id
              } else {
                sourceId = parentNodes[0].id
              }
            }

            await db.createTodoRow(node.id, sourceId)
          }

          for (const tagName of tags) {
            await db.createTagRow(tagName, newNode.id)
          }

          if (tags.length) {
            emitter.emit('REF_NODE_UPDATED', newNode)
          }
        }
      } else {
        let newNode = await db.createNode({
          id: item.id,
          type: isOutliner ? NodeType.COMMON : NodeType.LIST_ITEM,
          parentId: newParentId,
          spaceId: this.spaceId,
          collapsed: !!item.collapsed,
          element,
          children,
          date: this.date,
        })

        const node = new Node(newNode)

        if (node.isTodoElement) {
          const nodeService = new NodeService(node, this.allNodes)
          const parentNodes = nodeService.getParentNodes()

          let sourceId = ''
          if (parentNodes.length) {
            if (parentNodes[0].isDailyRoot) {
              sourceId = parentNodes[1].id
            } else {
              sourceId = parentNodes[0].id
            }
          }

          await db.createTodoRow(node.id, sourceId)
        }
      }
    }
  }
}
