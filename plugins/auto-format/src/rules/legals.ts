import { AutoformatRule } from '../types'

export const legals: AutoformatRule[] = [
  {
    mode: 'text',
    match: ['(tm)', '(TM)'],
    format: '™',
  },
  {
    mode: 'text',
    match: ['(r)', '(R)'],
    format: '®',
  },

  {
    mode: 'text',
    match: ['(c)', '(C)'],
    format: '©',
  },
  {
    mode: 'text',
    match: '&trade;',
    format: '™',
  },
  {
    mode: 'text',
    match: '&reg;',
    format: '®',
  },
  {
    mode: 'text',
    match: '&copy;',
    format: '©',
  },
  {
    mode: 'text',
    match: '&sect;',
    format: '§',
  },
]
