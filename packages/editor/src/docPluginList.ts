import blockSelector from './plugins/block-selector'
import frontMatter from './plugins/front-matter'
import image from './plugins/image'
import internalLink from './plugins/internal-link'
import link from './plugins/link'
import table from './plugins/table'

export const docPluginList = [
  link(),
  image(),
  blockSelector(),
  table(),
  frontMatter(),
  internalLink(),
]
