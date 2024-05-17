import jetpack from 'fs-jetpack'
import yargs, { ArgumentsCamelCase } from 'yargs'
import fetch from 'node-fetch'
import { join } from 'path'
import { getManifest } from '../lib/getManifest'
import { buildExtension } from '../lib/buildExtension'
import { iconToString } from '../lib/iconToString'
import { assetsToStringMap } from '../lib/assetsToStringMap'

type Args = {}

class Command {
  readonly command = 'dev'
  readonly describe = 'PenX dev'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    await buildExtension({
      watch: true,
      onSuccess: async () => {
        // console.log('Build success~')
        this.handleBuildSuccess()
      },
    })
  }

  private getIcon = async (iconName = '') => {}

  private handleBuildSuccess = async () => {
    const manifest = getManifest()

    const url = 'http://127.0.0.1:8080/api/upsert-extension'

    for (const command of manifest.commands) {
      const codePath = join(process.cwd(), 'dist', `${command.name}.js`)
      const code = jetpack.read(codePath, 'utf8')
      command.code = code
      command.icon = await iconToString(command.icon)
    }

    const assets = await assetsToStringMap()

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: manifest.id,
          name: manifest.name,
          version: manifest.version || '',
          icon: manifest.icon,
          commands: JSON.stringify(manifest.commands),
          assets: JSON.stringify(assets),
        }),
      }).then((res) => res.json())
    } catch (error) {
      console.log('upsert extension error:', error)
    }
  }
}

const command = new Command()

export default command
