import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_UL } from '@penx/list'
import { Node } from '@penx/model'
import { IDatabaseNode } from '@penx/types'

export function getDatabaseNodeEditorValue(node: Node<IDatabaseNode>) {
  return [
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
}
