import { ELEMENT_TITLE } from '@penx/constants'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_UL } from '@penx/list'
import { Node } from '@penx/model'
import { IDatabaseNode, INode } from '@penx/model-types'

export function getDatabaseRootEditorValue(
  node: Node,
  nodeMap: Map<string, INode>,
) {
  const children = node.children.map((id) => {
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
              type: 'database_entry', // TODO: don't hardcode
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
