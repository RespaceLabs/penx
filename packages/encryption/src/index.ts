import CryptoJS from 'crypto-js'

/**
 * Encryption function
 *  */
export function encryptString(plainText: string, secretKey: string) {
  const key = CryptoJS.enc.Utf8.parse(secretKey)
  // random IV
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    key,
    {
      iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.Pkcs7,
    },
  )

  return iv.toString() + encrypted.toString()
}

/** Decryption function */
export function decryptString(cipherTextWithIV: string, secretKey: string) {
  const key = CryptoJS.enc.Utf8.parse(secretKey)
  const iv = CryptoJS.enc.Hex.parse(cipherTextWithIV.slice(0, 32))
  const encryptedText = cipherTextWithIV.slice(32)
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.Pkcs7,
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
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
