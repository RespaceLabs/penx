import { renderMarkdown } from 'penx'

renderMarkdown('# Marketplace')

postMessage({
  type: 'marketplace',
})
