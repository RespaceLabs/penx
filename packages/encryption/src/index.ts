export async function encryptString(
  plainText: string,
  secretKey: CryptoKey,
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainText)

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    secretKey,
    data,
  )

  const encryptedBytes = new Uint8Array([
    ...iv,
    ...new Uint8Array(encryptedData),
  ])
  const encryptedText = btoa(String.fromCharCode(...encryptedBytes))
  return encryptedText
}

export async function decryptString(
  encryptedText: string,
  secretKey: CryptoKey,
): Promise<string> {
  const decoder = new TextDecoder()
  const encryptedBytes = Uint8Array.from(atob(encryptedText), (c) =>
    c.charCodeAt(0),
  )

  const iv = encryptedBytes.slice(0, 12)
  const encryptedData = encryptedBytes.slice(12)
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    secretKey,
    encryptedData,
  )

  const decryptedText = decoder.decode(decryptedData)
  return decryptedText
}

export async function calculateSHA256FromFile(file: File): Promise<string> {
  const buffer: ArrayBuffer = await file.arrayBuffer()
  const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray: Uint8Array = new Uint8Array(hashBuffer)
  const hashHex: string = Array.from(hashArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

function stringToUint8Array(text: string): Uint8Array {
  const encoder: TextEncoder = new TextEncoder()
  return encoder.encode(text)
}

export async function calculateSHA256FromString(text: string): Promise<string> {
  const data: Uint8Array = stringToUint8Array(text)
  const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray: Uint8Array = new Uint8Array(hashBuffer)
  const hashHex: string = Array.from(hashArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

export async function deriveAESKeyFromString(
  keyString: string,
  keyLength: number,
): Promise<CryptoKey> {
  if (keyLength !== 128 && keyLength !== 256) {
    throw new Error('Invalid key length. The key must be 128 or 256 bits.')
  }

  const encoder = new TextEncoder()
  const keyData = encoder.encode(keyString)

  const derivedKey = await crypto.subtle.digest('SHA-256', keyData)

  const importedKey = await crypto.subtle.importKey(
    'raw',
    derivedKey.slice(0, keyLength / 8),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )

  return importedKey
}
