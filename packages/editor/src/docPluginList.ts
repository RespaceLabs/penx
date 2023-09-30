import blockSelector from './plugins/block-selector'
import code from './plugins/code'
import frontMatter from './plugins/front-matter'
import image from './plugins/image'
import internalLink from './plugins/internal-link'
import link from './plugins/link'
import table from './plugins/table'

export const docPluginList = [
  link(),
  image(),
  code(),
  blockSelector(),
  table(),
  frontMatter(),
  internalLink(),
]
