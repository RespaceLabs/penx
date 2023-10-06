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
