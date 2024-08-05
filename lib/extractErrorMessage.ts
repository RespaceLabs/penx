export function extractErrorMessage(error: any) {
  const userRejectedMessageRaw = `User rejected the request`
  if (!error.shortMessage) {
    return error.message || `Unknown error`
  }

  const shortMessage: string = error?.shortMessage || ''

  if (shortMessage.includes(userRejectedMessageRaw)) {
    return `User rejected the request`
  }

  // if (Array.isArray(error.metaMessages) && error.metaMessages.length > 0) {
  //   let errorName: string = error.metaMessages[0] || ''
  //   errorName = errorName
  //     .replace(/^Error: /, '')
  //     .replace(/\(\)$/, '')
  //     .trim()

  //   return errorName || `Unknown error`
  // }

  return shortMessage || error.message || `Unknown error`
}
