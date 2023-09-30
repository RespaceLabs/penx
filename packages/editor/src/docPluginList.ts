import blockSelector from './plugins/block-selector'
import frontMatter from './plugins/front-matter'
import internalLink from './plugins/internal-link'
import table from './plugins/table'

export const docPluginList = [
  blockSelector(),
  table(),
  frontMatter(),
  internalLink(),
]
