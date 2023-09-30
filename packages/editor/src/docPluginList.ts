import blockSelector from './plugins/block-selector'
import frontMatter from './plugins/front-matter'
import internalLink from './plugins/internal-link'
import link from './plugins/link'
import table from './plugins/table'

export const docPluginList = [
  link(),
  blockSelector(),
  table(),
  frontMatter(),
  internalLink(),
]
