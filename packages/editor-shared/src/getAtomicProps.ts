import { Node } from 'slate'

/**
 * convert to fower atomic props
 * @param css
 * @returns
 */
export function getAtomicProps(css: any[] = []) {
  if (!Array.isArray(css)) return {}
  return css
    .filter((c) => c.type === 'atomic_props')
    .reduce((acc, cur) => {
      const key = Node.string(cur).trim()
      if (!key) return acc
      return { ...acc, [key]: true }
    }, {})
}
