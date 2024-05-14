import { renderMarkdown } from 'penx'
import { toBase64 } from './libs/toBase64'

renderMarkdown(toBase64('# hello world!'))
