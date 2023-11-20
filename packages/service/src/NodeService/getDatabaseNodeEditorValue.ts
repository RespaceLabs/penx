import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_UL } from '@penx/constants'
import { Node } from '@penx/model'
import { IDatabaseNode } from '@penx/model-types'

export function getDatabaseNodeEditorValue(node: Node) {
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
