import { Box } from '@fower/react'
import { CatalogueNode } from '@penx/catalogue'
import { useCatalogue } from '@penx/hooks'
import { CatalogueItem } from './CatalogueItem'

export const CatalogueBody = () => {
  const { nodes } = useCatalogue()
  return <Box column>{renderCatalogue(nodes || [], 0)}</Box>
}

function renderCatalogue(nodes: CatalogueNode[], level = 0) {
  return nodes.map((node) => {
    if (!node.children?.length) {
      return <CatalogueItem key={node.id} item={node} level={level} />
    }
    return (
      <Box key={node.id}>
        <CatalogueItem item={node} level={level} />
        <Box display={node.isFolded ? 'none' : 'block'}>
          {renderCatalogue(node.children, level + 1)}
        </Box>
      </Box>
    )
  })
}
