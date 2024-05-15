import jetpack from 'fs-jetpack'
import yargs, { ArgumentsCamelCase } from 'yargs'
import fetch from 'node-fetch'
import * as tsup from 'tsup'
import { join } from 'path'
import fs from 'fs'

type Args = {}

type CommandItem = {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string
  code?: string
}

type Manifest = {
  name: string
  id: string
  version: string
  description: string
  main: string
  code: string
  icon: string
  commands: CommandItem[]
}

function getManifest(): Manifest {
  const manifestPath = join(process.cwd(), 'manifest.json')
  const manifest = jetpack.read(manifestPath, 'json')
  return manifest
}

class Command {
  readonly command = 'dev'
  readonly describe = 'PenX dev'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  private entries: string[] = []

  handler = async (args: ArgumentsCamelCase<Args>) => {
    const cwd = process.cwd()
    const manifest = getManifest()

    this.entries = manifest.commands.reduce<string[]>((acc, cur) => {
      const entry = join(cwd, 'src', `${cur.name}.ts`)
      return [...acc, entry]
    }, [])

    tsup.build({
      entry: this.entries,
      format: ['cjs', 'esm'],
      watch: true,
      tsconfig: join(cwd, 'tsconfig.json'),
      splitting: true,
      treeshake: true,
      minify: true,
      noExternal: ['penx'],
      onSuccess: async () => {
        // console.log('Build success~')
        this.handleBuildSuccess()
      },
    })
  }

  private getLogo = async (iconName = '') => {
    if (!iconName) return ''
    try {
      const cwd = process.cwd()
      const iconPath = join(cwd, 'assets', iconName)
      if (iconName.endsWith('.svg')) {
        return jetpack.read(iconPath, 'utf8')
      }

      return fs.readFileSync(iconPath).toString('base64')
    } catch (error) {
      return ''
    }
  }

  private handleBuildSuccess = async () => {
    const manifest = getManifest()

    const url = 'http://127.0.0.1:8080/api/upsert-extension'

    for (const command of manifest.commands) {
      const codePath = join(process.cwd(), 'dist', `${command.name}.js`)
      const code = jetpack.read(codePath, 'utf8')
      command.code = code
      command.icon = await this.getLogo(command.icon)
    }

    const logoString = await this.getLogo(manifest.icon)

    // console.log('========logoString:', logoString)

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
          icon: logoString,
          commands: JSON.stringify(manifest.commands),
        }),
      }).then((res) => res.json())
    } catch (error) {
      console.log('upsert extension error:', error)
    }
  }
}

const command = new Command()

export default command
