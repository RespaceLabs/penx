export * from './useCopyToClipboard'
export * from './docToMarkdown'

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
