import mitt from 'mitt'
import { IDoc } from '@penx/local-db'
import { CatalogueNode } from './CatalogueNode'
import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  CreateCatalogueNodeOptions,
  WithFlattenProps,
} from './types'
import { flattenTree } from './utils'

type Events = {
  ADD_NODE: CatalogueNode
  DELETE_NODE: CatalogueNode
  SWITCH_FOLDED: string
  UPDATE_EMOJI: string

  LOADING: undefined
  CATALOGUE_INITED: undefined

  UPDATE_NODE_NAME: {
    id: string
    name: string
  }
}

export class CatalogueTree {
  emitter = mitt<Events>()

  nodes: CatalogueNode[] = []

  constructor(nodes: CatalogueNode[] = []) {
    this.nodes = nodes
  }

  get firstNodeId(): string {
    return this.nodes[0]?.id
  }

  get firstDocNodeId(): string {
    const nodes = this.flatten(CatalogueNodeType.DOC)
    return nodes[0]?.id
  }

  static fromJSON(json: IDoc[] = []): CatalogueTree {
    function convert(nodes: IDoc[]): CatalogueNode[] {
      return nodes.map((node) => {
        const catalogue = new CatalogueNode({
          name: node.title,
          id: node.id,
          type: CatalogueNodeType.DOC,
          emoji: node.emoji,
        })
        return catalogue
      })

      // return nodes.map((node) => {
      //   if (!node.children?.length) return new CatalogueNode(node)
      //   const catalogue = new CatalogueNode(node)
      //   catalogue.children = convert(node.children)
      //   return catalogue
      // })
    }

    const tree = new CatalogueTree(convert(json))

    return tree
  }

  init = (str = '[]', shouldEmit = false) => {
    const arr: CatalogueNodeJSON[] = JSON.parse(str)

    function convert(nodes: CatalogueNodeJSON[]): CatalogueNode[] {
      return nodes.map((node) => {
        if (!node.children?.length) return new CatalogueNode(node)
        const catalogue = new CatalogueNode(node)
        catalogue.children = convert(node.children)
        return catalogue
      })
    }

    this.nodes = convert(arr)

    if (shouldEmit) {
      this.emitter.emit('CATALOGUE_INITED')
    }
  }

  toJSON = () => {
    function convert(nodes: CatalogueNode[]): CatalogueNodeJSON[] {
      return nodes.map((node) => {
        if (!node.children?.length) return node.toJSON()
        return {
          ...node.toJSON(),
          children: convert(node.children),
        }
      })
    }
    return convert(this.nodes)
  }

  stringify = () => {
    return JSON.stringify(this.toJSON())
  }

  addNode = (opt: CreateCatalogueNodeOptions, parentId?: string) => {
    const newNode = new CatalogueNode(opt)
    if (!parentId) this.nodes.push(newNode)

    function traverse(nodes: CatalogueNode[]) {
      for (const node of nodes) {
        if (!node.isGroup) continue

        if (node.id === parentId) {
          if (!node.children) node.children = []
          node.children.push(newNode)
        } else {
          if (node.children?.length) traverse(node.children)
        }
      }
    }

    traverse(this.nodes)

    return newNode
  }

  findNode = (id: string): CatalogueNode | undefined => {
    let node: CatalogueNode | undefined
    const findNodeById = (nodes: CatalogueNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]

        if (item.id === id) {
          node = item
          break
        }
        if (item.children?.length) findNodeById(item.children)
      }
    }
    findNodeById(this.nodes)
    return node
  }

  getNodeFullPathname = (id: string): string => {
    let pathname = ''
    const findNodeById = (nodes: CatalogueNode[], parentPath = '') => {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]

        if (item.children?.length) {
          findNodeById(item.children, `${parentPath}/${item.pathname}`)
        }

        if (item.id === id) {
          pathname = parentPath + `/${item.pathname}`
          break
        }
      }
    }
    findNodeById(this.nodes)
    return pathname
  }

  getNodeByFullPathname(pathname: string): CatalogueNode {
    console.log('pathname', pathname)

    return {} as any
  }

  flatten = (
    type?: CatalogueNodeType,
    nodes: CatalogueNode[] = this.nodes,
  ): WithFlattenProps<CatalogueNode>[] => {
    return flattenTree(nodes, type, null, 0)
  }

  getSiblings = (id: string) => {
    const nodes = this.flatten(CatalogueNodeType.DOC)
    const index = nodes.findIndex((node) => node.id === id)
    return {
      prev: nodes[index - 1],
      cur: nodes[index],
      next: nodes[index + 1],
    }
  }

  deleteNode = (idOrNode: string | CatalogueNode) => {
    let deletedNode: CatalogueNode | undefined = undefined
    const deleteNodeById = (nodes: CatalogueNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]

        if (item.id === idOrNode || item === idOrNode) {
          const deletedNodes = nodes.splice(i, 1)
          deletedNode = deletedNodes[0]
          break
        }
        if (item.children?.length) deleteNodeById(item.children)
      }
    }
    deleteNodeById(this.nodes)
    return deletedNode
  }

  switchFolded = (id: string) => {
    const node: CatalogueNode | undefined = this.findNode(id)
    if (node) {
      node.isFolded = !node.isFolded
    }
  }

  updateEmoji = (id: string, unified: string) => {
    const node: CatalogueNode | undefined = this.findNode(id)
    if (node) {
      node.emoji = unified
      this.emitter.emit('UPDATE_EMOJI', id)
    }
  }

  updateNodeName = (id: string, name: string) => {
    const node: CatalogueNode | undefined = this.findNode(id)

    if (node && node.name !== name) {
      node.name = name
      this.emitter.emit('UPDATE_NODE_NAME', { id, name })
    }
  }
}
