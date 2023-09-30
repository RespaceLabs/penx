import blockSelector from './plugins/block-selector'
import frontMatter from './plugins/front-matter'
import table from './plugins/table'

export const docPluginList = [blockSelector(), table(), frontMatter()]
