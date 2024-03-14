import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { decrypt, encrypt } from 'eciesjs'
import { privateToPublic } from 'ethereumjs-util'
import hdkey from 'hdkey'
import { get, set } from 'idb-keyval'
import {
  calculateSHA256FromString,
  decryptString,
  encryptString,
} from '@penx/encryption'

export async function getNewMnemonic() {
  const mnemonic = generateMnemonic()
  return mnemonic
}

export async function setMnemonicToLocal(secret: string, mnemonic: string) {
  const key = calculateSHA256FromString(secret)
  const encryptedMnemonic = encryptString(mnemonic, key)
  await set(key, encryptedMnemonic)
  return mnemonic
}

export async function getMnemonicFromLocal(secret: string) {
  const key = calculateSHA256FromString(secret)
  const encryptedMnemonic = await get(key)
  const mnemonic = decryptString(encryptedMnemonic, key)
  // console.log('=========mnemonic:', mnemonic)
  return mnemonic
}

export async function getPublicKey(mnemonic: string) {
  const seed = await mnemonicToSeed(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const publicKey = privateToPublic(root.privateKey).toString('hex')
  return publicKey
}

export function encryptByPublicKey(publicKey: string, plainText: string) {
  const data = Buffer.from(plainText)
  const encrypted = encrypt(publicKey, data)
  const base64String = encrypted.toString('base64')
  return base64String
}

export async function decryptByMnemonic(
  mnemonic: string,
  base64String: string,
) {
  const buffer = base64ToBuffer(base64String)
  const seed = await mnemonicToSeed(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const privateKey = root.privateKey.toString('hex')
  return decrypt(privateKey, buffer).toString()
}

function base64ToBuffer(data: string) {
  const binaryData = atob(data)
  const arrayBuffer = new ArrayBuffer(binaryData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i)
  }

  const buffer = Buffer.from(uint8Array)
  return buffer
}
