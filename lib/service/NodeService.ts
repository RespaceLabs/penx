import isEqual from 'react-fast-compare'
import { ITitleElement } from '@/components/editor/plugins/title-plugin'
import { db, emitter } from '@/lib/local-db'
import { INode, Node, NodeType } from '@/lib/model'
import { store } from '@/store'
import _ from 'lodash'
import { Node as SlateNode, Transforms } from 'slate'
import { extractTags } from '../extractTags'
import { api } from '../trpc'

export class NodeService {
  nodeMap = new Map<string, INode>()

  childrenNodes: Node[] = []

  private date: string

  constructor(
    private node: Node,
    public allNodes: Node[],
  ) {
    for (const item of allNodes) {
      this.nodeMap.set(item.id, item.raw)
    }

    this.childrenNodes = node.raw.children.map((id) => {
      return new Node(this.nodeMap.get(id)!)
    })

    const parentNodes = this.getParentNodes()

    if (parentNodes.length > 1 && parentNodes[0].isDailyRoot) {
      const dateNode = parentNodes[1]
      if (dateNode) {
        this.date = dateNode.date || ''
      }
    }
  }

  get userId() {
    return (window as any).__USER_ID__
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
    while (node.parentId) {
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
    await this.updateNode(id, {
      folded: !folded,
    })

    const nodes = await db.listNodesByUserId(this.userId)

    store.node.setNodes(nodes)
  }

  private async saveTitle(node: INode, title: ITitleElement) {
    if (!title) return

    if (this.node.isDatabase) {
      if (!this.node.isTodoDatabase) {
        node = await this.updateNode(node.id, {
          props: {
            ...node.props,
            name: SlateNode.string(title),
          },
        })
      }
      return
    }

    const oldHash = new Node(node).toHash()
    const newHash = new Node({
      ...node,
      element: title.children,
      props: title.props,
    }).toHash()

    if (oldHash !== newHash) {
      console.log('==title==oldHash:', oldHash, 'newHash:', newHash)

      node = await this.updateNode(node.id, {
        element: title.children,
        props: {
          ...node.props,
          ...title.props,
          image: title?.props?.image,
        },
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

    const nodes = await db.listNodesByUserId(this.userId)

    store.node.setNodes(nodes)

    try {
      if ((window as any).__SYNCING__) return
      ;(window as any).__SYNCING__ = true
      await api.node.sync.mutate({
        nodes: JSON.stringify(nodes),
      })
      ;(window as any).__SYNCING__ = false
    } catch (error) {
      ;(window as any).__SYNCING__ = false
      console.log('error syncing nodes:', error)
    }
  }

  saveBlockNodes = async (parentId: string, elements: any[]) => {
    const userId = (window as any).__USER_ID__
    const nodeChildren = elements.map((n) => n.id)
    if (!isEqual(this.node.children, nodeChildren)) {
      await this.updateNode(this.node.id, {
        children: nodeChildren,
      })
    }

    for (const item of elements) {
      const node = await db.getNode(item.id)
      const tags = extractTags([item])

      if (node) {
        const oldHash = new Node(node).toHash()
        const newHash = new Node({
          ...node,
          element: [item],
        }).toHash()

        const userId = (window as any).__USER_ID__

        if (oldHash !== newHash) {
          const newNode = await this.updateNode(item.id, {
            element: [item],
            children: [], // TODO:
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

            await db.createTodoRow(userId, node.id, sourceId)
          }

          for (const tagName of tags) {
            await db.createTagRow(userId, tagName, newNode.id)
          }

          if (tags.length) {
            emitter.emit('REF_NODE_UPDATED', newNode)
          }
        }
      } else {
        let newNode: INode

        newNode = await this.createNode({
          id: item.id,
          parentId,
          element: [item],
          children: [], // TODO:
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

          await db.createTodoRow(userId, node.id, sourceId)
        }

        if (node.isFileElement) {
          await db.createFileRow({
            userId,
            ref: node.id,
            fileHash: node.fileHash,
            googleDriveFileId: node.googleDriveFileId,
          })
        }

        for (const tagName of tags) {
          await db.createTagRow(userId, tagName, newNode.id)
        }
      }
    }
  }

  private createNode<T extends INode>(data: Partial<T>) {
    if (this.date) data.date = this.date
    return db.createNode({
      userId: this.userId,
      ...data,
    })
  }

  private updateNode<T extends INode>(nodeId: string, data: Partial<T>) {
    if (this.date) data.date = this.date
    return db.updateNode(nodeId, {
      ...data,
    })
  }
}
