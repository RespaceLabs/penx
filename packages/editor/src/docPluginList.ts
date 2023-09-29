import autoNodeId from './plugins/auto-node-id'
import autoformat from './plugins/autoformat'
import blockSelector from './plugins/block-selector'
import checkList from './plugins/check-list'
import code from './plugins/code'
import frontMatter from './plugins/front-matter'
import image from './plugins/image'
import internalLink from './plugins/internal-link'
import link from './plugins/link'
import list from './plugins/list'
import paragraph from './plugins/paragraph'
import table from './plugins/table'

export const docPluginList = [
  autoNodeId(),
  link(),
  image(),
  code(),
  paragraph(),
  blockSelector(),
  checkList(),
  autoformat(),
  list(),
  table(),
  frontMatter(),
  internalLink(),
]
