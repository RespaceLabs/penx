import { CustomElement } from '@penx/editor-types'
import { slateToMarkdown } from '@penx/serializer'

export function docToMarkdown(doc: any) {
  const title = doc.title
  const nodes: CustomElement[] = JSON.parse(doc.content || '[]')
  const md = slateToMarkdown(nodes)
  return `# ${title}\n` + md
}
