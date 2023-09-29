import { AutoformatRule } from '../types'

export const punctuations: AutoformatRule[] = [
  {
    mode: 'text',
    match: '--',
    format: '\u2014',
  },
  {
    mode: 'text',
    match: '...',
    format: '…',
  },
  // {
  //   mode: 'text',
  //   match: '>>',
  //   format: '»',
  // },
  // {
  //   mode: 'text',
  //   match: '<<',
  //   format: '«',
  // },
]
