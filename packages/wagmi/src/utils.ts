import { bytesToString, hexToBytes } from 'viem'

export function hexToString(code: any): string {
  const bytes = hexToBytes(code)
  const originalString = bytesToString(bytes)
  return originalString.replaceAll('\u0000', '')
}
