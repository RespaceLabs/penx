import { AutoformatRule } from '../types'
import { blocks } from './blocks'
import { legals } from './legals'
import { lists } from './lists'
import { marks } from './marks'
import { punctuations } from './punctuations'

export const rules: AutoformatRule[] = [
  ...blocks,
  ...legals,
  ...lists,
  ...marks,
  ...punctuations,
]
