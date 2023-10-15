export * from './useCopyToClipboard'
export * from './docToMarkdown'
export * from './md5'

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
