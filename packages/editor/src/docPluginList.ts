import autoNodeId from './plugins/auto-node-id'
import autoformat from './plugins/autoformat'
import blockSelector from './plugins/block-selector'
import blockquote from './plugins/blockquote'
import checkList from './plugins/check-list'
import code from './plugins/code'
import divider from './plugins/divider'
import frontMatter from './plugins/front-matter'
import heading from './plugins/heading'
import image from './plugins/image'
import internalLink from './plugins/internal-link'
import link from './plugins/link'
import list from './plugins/list'
import paragraph from './plugins/paragraph'
import saveToServer from './plugins/save-to-server'
import table from './plugins/table'

export const docPluginList = [
  autoNodeId(),
  link(),
  image(),
  divider(),
  heading(),
  blockquote(),
  code(),
  paragraph(),
  blockSelector(),
  saveToServer(),
  checkList(),
  autoformat(),
  list(),
  table(),
  frontMatter(),
  internalLink(),
]
