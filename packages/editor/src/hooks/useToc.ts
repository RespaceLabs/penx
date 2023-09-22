import { Node } from 'slate'
import { getState, mutate, useStore } from 'stook'
import { convertToValidHtmlId } from '@penx/catalogue'

interface Heading {
  type: string
  level: number
  title: string
  id: string
  inView: boolean
}

export const generateTOC = (nodes: Node[]) => {
  const headings: Heading[] = []
  nodes.forEach((node) => {
    if (['h1', 'h2', 'h3', 'h4'].includes(node.type)) {
      const level = Number(node.type.replace(/^h/, ''))
      const title = Node.string(node)
      const id = convertToValidHtmlId(title)

      const heading: Heading = {
        level,
        title,
        id,
        inView: false,
        type: node.type,
      }
      headings.push(heading)
    }
  })

  let startLevel = 4
  for (const item of headings) {
    const level = Number(item.type.replace(/^h/, ''))
    if (startLevel > level) startLevel = level
  }

  for (const item of headings) {
    item.level = item.level - startLevel + 1
  }

  return headings
}

const key = '$$_TOC'

export function useToc(content: string = '[]') {
  const headings = generateTOC(JSON.parse(content || '[]'))
  const [toc, setToc] = useStore(key, headings)
  const activeSlug = toc.find((t) => t.inView)?.id

  function generate(content: string = '[]') {
    const headings = generateTOC(JSON.parse(content || '[]'))
    setToc(headings)
  }

  return {
    activeSlug,
    toc,
    setToc,
    generate,
  }
}

export function getToc(): Heading[] {
  return getState(key)
}

export function mutateToc(slug: string, inView: boolean = false) {
  mutate(key, (headings: Heading[]) => {
    for (const heading of headings) {
      if (heading.id === slug) {
        heading.inView = inView
      }
    }
  })
}
