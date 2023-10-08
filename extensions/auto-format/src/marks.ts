import { AutoformatRule } from '@penx/autoformat'
import { MarkType } from './mark-type.enum'

export const marks: AutoformatRule[] = [
  {
    mode: 'mark',
    type: [MarkType.bold, MarkType.italic],
    match: '***',
  },
  {
    mode: 'mark',
    type: [MarkType.underline, MarkType.italic],
    match: '__*',
  },
  {
    mode: 'mark',
    type: [MarkType.underline, MarkType.bold],
    match: '__**',
  },
  {
    mode: 'mark',
    type: [MarkType.underline, MarkType.bold, MarkType.italic],
    match: '___***',
  },
  {
    mode: 'mark',
    type: MarkType.bold,
    match: '**',
  },
  {
    mode: 'mark',
    type: MarkType.underline,
    match: '__',
  },
  {
    mode: 'mark',
    type: MarkType.italic,
    match: '*',
  },
  {
    mode: 'mark',
    type: MarkType.italic,
    match: '_',
  },
  {
    mode: 'mark',
    type: MarkType.strike_through,
    match: '~~',
  },
  {
    mode: 'mark',
    type: MarkType.superscript,
    match: '^',
  },
  {
    mode: 'mark',
    type: MarkType.subscript,
    match: '~',
  },
  {
    mode: 'mark',
    type: MarkType.highlight,
    match: '==',
  },
  {
    mode: 'mark',
    type: MarkType.highlight,
    match: '≡',
  },
  {
    mode: 'mark',
    type: MarkType.code,
    match: '`',
  },
]
