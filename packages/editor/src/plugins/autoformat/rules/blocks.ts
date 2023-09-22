import { ElementType } from '@penx/editor-shared'
import { insertNodes, setNodes } from '@penx/editor-transforms'
import { insertEmptyCodeBlock } from '../../code/insertEmptyCodeBlock'
import { clearBlockFormat } from '../autoformatUtils'
import { AutoformatRule } from '../types'

export const blocks: AutoformatRule[] = [
  {
    mode: 'block',
    type: ElementType.h1,
    match: '# ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.h2,
    match: '## ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.h3,
    match: '### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.h4,
    match: '#### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.h5,
    match: '##### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.h6,
    match: '###### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.blockquote,
    match: '> ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ElementType.hr,
    match: ['---', '—-'],
    preFormat: clearBlockFormat,
    format: (editor) => {
      setNodes(editor, { type: ElementType.hr })
      insertNodes(editor, {
        type: ElementType.p,
        children: [{ text: '' }],
      })
    },
  },
  {
    mode: 'block',
    type: ElementType.code_block,
    match: '```',
    triggerAtBlockStart: false,
    preFormat: clearBlockFormat, // TODO: 可以不要
    format: (editor) => {
      insertEmptyCodeBlock(editor, {
        insertNodesOptions: { select: true },
      })
    },
  },
]
