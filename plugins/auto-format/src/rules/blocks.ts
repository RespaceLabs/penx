import { insertNodes, setNodes } from '@penx/editor-transforms'
// import { insertEmptyCodeBlock } from '../../code/insertEmptyCodeBlock'
import { clearBlockFormat } from '../autoformatUtils'
import { AutoformatRule } from '../types'

export const blocks: AutoformatRule[] = [
  {
    mode: 'block',
    type: 'h1',
    match: '# ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'h2',
    match: '## ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'h3',
    match: '### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'h4',
    match: '#### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'h5',
    match: '##### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'h6',
    match: '###### ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'blockquote',
    match: '> ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: 'hr',
    match: ['---', '—-'],
    preFormat: clearBlockFormat,
    format: (editor) => {
      setNodes(editor, { type: 'hr' })
      insertNodes(editor, {
        type: 'p',
        children: [{ text: '' }],
      } as any)
    },
  },
  // {
  //   mode: 'block',
  //   type: 'code_block',
  //   match: '```',
  //   triggerAtBlockStart: false,
  //   preFormat: clearBlockFormat,
  //   format: (editor) => {
  //     insertEmptyCodeBlock(editor, {
  //       insertNodesOptions: { select: true },
  //     })
  //   },
  // },
]
