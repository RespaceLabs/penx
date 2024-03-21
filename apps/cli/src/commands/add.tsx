import yargs, { ArgumentsCamelCase } from 'yargs'
import { decrypt, encrypt } from 'eciesjs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import { INode } from '../types/INode'
import { ISpace } from '../types/ISpace'
import { readConfig } from '../utils'
import { createNodeFromText } from '../createNodeFromText'

type Args = {
  text?: string[]
}

export function encryptByPublicKey(plainText: string, publicKey: string) {
  const data = Buffer.from(plainText)
  const encrypted = encrypt(publicKey, data)
  const base64String = encrypted.toString('base64')
  return base64String
}

export async function pushNodes(user: any, space: ISpace, nodes: INode[]) {
  const baseURL = space.syncServerUrl || ''
  const token = space.syncServerAccessToken || ''
  const pushNodesURL = `${baseURL}/pushNodes`

  const publicKey = user.publicKey
  const encryptedNodes = nodes.map((node) => ({
    ...node,
    spaceId: space.id,
    element: encryptByPublicKey(JSON.stringify(node.element), publicKey),
    props: encryptByPublicKey(JSON.stringify(node.props), publicKey),
  }))

  try {
    const res = await fetch(pushNodesURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isTodayNode: true,
        token: token,
        spaceId: space.id,
        nodes: encryptedNodes,
      }),
    })

    const json = await res.json()
  } catch (error) {
    console.error(error)
  }
}

class Command {
  readonly command = 'add <text...>'
  readonly describe = 'Add text to PenX'

  cwd = process.cwd()

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    const { text = [] } = args
    const textStr = text.join(' ').trim()
    const config = readConfig()
    const node = createNodeFromText(textStr)
    await pushNodes(config.user, config.space as any, [node])
  }
}

const add = new Command()

export default add
