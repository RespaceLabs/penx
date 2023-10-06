import CryptoJS from 'crypto-js'

// secret_key
const key = CryptoJS.enc.Utf8.parse('B3Nmynbt43ywqUr3XD3cjVW7vRW1Ks8AZwziya0')

/** Encryption function */
export function encryptString(plainText: string) {
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
export function decryptString(cipherTextWithIV: string) {
  const iv = CryptoJS.enc.Hex.parse(cipherTextWithIV.slice(0, 32))
  const encryptedText = cipherTextWithIV.slice(32)
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.Pkcs7,
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
}
