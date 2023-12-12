import {
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from '@penx/constants'
import { Node } from '@penx/model'
import { INode } from '@penx/model-types'

/**
 * single node to slate
 * @param node
 * @param allNodes
 * @returns
 */
export function nodeToSlate(node: INode, allNodes: INode[]) {
  const serializer = new NodeToSlateSerializer(
    new Node(node),
    allNodes.map((n) => new Node(n)),
  )
  return serializer.getEditorValue()
}

export class NodeToSlateSerializer {
  nodeMap = new Map<string, INode>()

  childrenNodes: Node[] = []

  constructor(
    private node: Node,
    public allNodes: Node[],
  ) {
    for (const item of allNodes) {
      this.nodeMap.set(item.id, item.raw)
    }

    this.childrenNodes = node.raw.children
      // TODO: why get an undefined node
      .filter((id) => !!this.nodeMap.get(id))
      .map((id) => {
        return new Node(this.nodeMap.get(id)!)
      })
  }

  get spaceId() {
    return this.node.spaceId
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
      const listItems = children
        // TODO: why get an undefined node, need to check it
        .filter((id) => !!this.nodeMap.get(id))
        .map((id) => {
          const node = this.nodeMap.get(id)!

          const liChildren = [
            {
              id: node.id,
              type: ELEMENT_LIC,
              nodeType: node.type,
              parentId,
              collapsed: node.collapsed,
              // children: node.element,
              // TODO:
              children: Array.isArray(node.element)
                ? node.element
                : [node.element],
            },
          ]

          if (node.children) {
            const ul = childrenToList(node.children, node.id)
            if (ul) liChildren.push(ul as any)
          }

          return {
            type: ELEMENT_LI,
            children: liChildren,
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
            children: node.element,
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

    const value: any[] = []

    if (isCreateTitle) {
      value.push({
        id: this.node.id,
        type: ELEMENT_TITLE,
        props: this.node.props,
        nodeType: this.node.type,
        children: this.node.element,
      })
    }

    if (childrenNodes.length) {
      value.push(content)
    }

    return value
  }
}

function getDatabaseNodeEditorValue(node: Node) {
  // console.log('node-------:', node)

  const value = [
    {
      id: node.id,
      type: ELEMENT_TITLE,
      props: node.props,
      nodeType: node.type,
      children: node.element,
    },
    {
      type: ELEMENT_UL,
      children: [
        {
          type: ELEMENT_LI,
          children: [
            {
              id: node.id,
              type: ELEMENT_LIC,
              nodeType: node.type,
              props: node.props,
              collapsed: node.collapsed,
              children: [
                {
                  type: 'database', // TODO: don't hardcode
                  databaseId: node.id,
                  children: [{ text: '' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  return value
}

function getDatabaseRootEditorValue(node: Node, nodeMap: Map<string, INode>) {
  const children = node.children
    // TODO: why get an undefined node
    .filter((id) => nodeMap.get(id))
    .map((id) => {
      const databaseNode = nodeMap.get(id)!
      return {
        type: ELEMENT_LI,
        children: [
          {
            id: databaseNode.id,
            type: ELEMENT_LIC,
            nodeType: databaseNode.type,
            props: databaseNode.props,
            collapsed: databaseNode.collapsed,
            children: [
              {
                type: ELEMENT_DATABASE_ENTRY,
                databaseId: databaseNode.id,
                props: databaseNode.props,
                name: databaseNode.props.name,
                children: [{ text: databaseNode.props.name }],
              },
            ],
          },
        ],
      }
    })

  const value: any[] = [
    {
      id: node.id,
      type: ELEMENT_TITLE,
      props: node.props,
      nodeType: node.type,
      children: [
        {
          type: 'p',
          children: [{ text: 'Tags' }],
        },
      ],
    },
  ]

  if (node.children.length) {
    value.push({
      type: ELEMENT_UL,
      children,
    })
  }

  return value
}
