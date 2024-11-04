import * as autoFormat from '@/editor-extensions/auto-format'
import * as bidirectionalLink from '@/editor-extensions/bidirectional-link'
import * as blockSelector from '@/editor-extensions/block-selector'
import * as blockquote from '@/editor-extensions/blockquote'
import * as checkList from '@/editor-extensions/check-list'
import * as codeBlock from '@/editor-extensions/code-block'
import * as database from '@/editor-extensions/database'
import * as divider from '@/editor-extensions/divider'
import * as File from '@/editor-extensions/file'
import * as heading from '@/editor-extensions/heading'
import * as image from '@/editor-extensions/image'
import * as link from '@/editor-extensions/link'
import * as list from '@/editor-extensions/list'
import * as paragraph from '@/editor-extensions/paragraph'
import * as table from '@/editor-extensions/table'

export const extensionList = [
  {
    id: 'block-selector',
    activate: blockSelector.activate,
  },

  {
    id: 'paragraph',
    activate: paragraph.activate,
  },

  {
    id: 'heading',
    activate: heading.activate,
  },

  {
    id: 'blockquote',
    activate: blockquote.activate,
  },
  {
    id: 'divider',
    activate: divider.activate,
  },
  {
    id: 'check-list',
    activate: checkList.activate,
  },
  {
    id: 'auto-format',
    activate: autoFormat.activate,
  },
  {
    id: 'list',
    activate: list.activate,
  },
  // {
  //   id: 'code-block',
  //   activate: codeBlock.activate,
  // },
  {
    id: 'image',
    activate: image.activate,
  },
  {
    id: 'link',
    activate: link.activate,
  },
  // { id: 'bidirectional-link', activate: bidirectionalLink.activate },
  // {
  //   id: 'table',
  //   activate: table.activate,
  // },
  // {
  //   id: 'file',
  //   activate: File.activate,
  // },

  {
    id: 'database',
    activate: database.activate,
  },
]
