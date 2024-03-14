import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { decrypt, encrypt } from 'eciesjs'
import { privateToAddress, privateToPublic, toBuffer } from 'ethereumjs-util'
import hdkey from 'hdkey'

// const mnemonic: string = generateMnemonic()

const mnemonic =
  'debris aunt vote victory enemy offer dad track hollow desert baby blame'

export async function run() {
  const seed = await mnemonicToSeed(mnemonic)
  const root = hdkey.fromMasterSeed(seed)

  // // console.log('=======root:', root)
  const privateKey = root.privateKey.toString('hex')

  const publicKey = privateToPublic(root.privateKey).toString('hex')

  const data = Buffer.from('Hello world!')

  const encrypted = encrypt(publicKey, data)
  const encryptedHex = encrypted.toString('hex')

  // const buffer = Buffer.from(encryptedHex, 'hex')

  const base64String = encrypted.toString('base64')
  console.log('=========base64String:', base64String)

  const buffer = base64ToBuffer(base64String)

  // console.log('==========encrypted:', encrypted.toString('base64'))
  console.log('==========encrypted:', encrypted.toString('hex'))

  // const r = decrypt(privateKey, encrypted).toString()
  const r = decrypt(privateKey, buffer).toString()
  console.log('r====:', r)
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
