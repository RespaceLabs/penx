import yargs, { ArgumentsCamelCase } from 'yargs'
import { encrypt } from 'eciesjs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import { INode } from '../types/INode'
import { ISpace } from '../types/ISpace'
import { readConfig } from '../lib/utils'
import { selectSpace } from '../lib/selectSpace'
import { createNodeFromText } from '../lib/createNodeFromText'
import { PORT } from '../constants'

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
  const baseURL = user.syncServerUrl || ''
  const token = user.syncServerAccessToken || ''
  const pushNodesURL = `${baseURL}/pushNodes`

  const publicKey = user.publicKey
  const encryptedNodes = nodes.map((node) => ({
    ...node,
    spaceId: space.id,
    element: node.element ? encryptByPublicKey(JSON.stringify(node.element), publicKey) : null,
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

    if (!config.user || !config.token) {
      console.log(
        chalk.yellow('Please login first, try to login by command:'),
        chalk.green('penx login'),
      )
      return
    }

    if (!config.space) {
      await selectSpace()
    }

    const isAdded = await this.addTextByAgent(textStr)

    if (isAdded) return

    const node = createNodeFromText(textStr)
    await pushNodes(config.user, config.space as any, [node])
  }

  private async addTextByAgent(textStr: string) {
    const url = `http://localhost:${PORT}/add-text`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textStr,
        }),
      })

      await response.json()
      return true
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error(chalk.red('PenX agent is not running'))
      }
      return false
    }
  }

  private addTextBySyncServer() {
    //
  }
}

const command = new Command()

export default command
