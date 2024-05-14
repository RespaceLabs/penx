export function toString(encodedString: string) {
  try {
    const decodedBytes = atob(encodedString)
      .split('')
      .map((c) => c.charCodeAt(0))
    const decodedString = new TextDecoder().decode(new Uint8Array(decodedBytes))
    return decodedString
  } catch (error) {
    return 'Invalid base64 string'
  }
}
