import blockSelector from './plugins/block-selector'
import code from './plugins/code'
import frontMatter from './plugins/front-matter'
import image from './plugins/image'
import internalLink from './plugins/internal-link'
import link from './plugins/link'
import paragraph from './plugins/paragraph'
import table from './plugins/table'

export const docPluginList = [
  link(),
  image(),
  code(),
  paragraph(),
  blockSelector(),
  table(),
  frontMatter(),
  internalLink(),
]
