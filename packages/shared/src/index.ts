export * from './useCopyToClipboard'
export * from './docToMarkdown'
export * from './md5'

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function matchNumber(input: string, precision = 10) {
  const regex = new RegExp(`^(\\d+)?(\\.\\d{0,${precision}}?)?$`)
  return regex.test(input)
}
