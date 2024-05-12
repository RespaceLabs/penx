import jetpack from 'fs-jetpack'
import yargs, { ArgumentsCamelCase } from 'yargs'
import fetch from 'node-fetch'
import * as tsup from 'tsup'
import { join } from 'path'

type Args = {}

type CommandItem = {
  name: string
  title: string
  subtitle: string
  description: string
}

type ExtensionData = {
  name: string
  id: string
  version: string
  description: string
  main: string
  code: string
  commands: CommandItem[]
}

function getExtensionData(): ExtensionData {
  const manifestPath = join(process.cwd(), 'manifest.json')
  const manifest = jetpack.read(manifestPath, 'json')
  const code = jetpack.read(join(process.cwd(), manifest.main), 'utf8')
  return { ...manifest, code }
}

class Command {
  readonly command = 'dev'
  readonly describe = 'PenX dev'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    //
    const cwd = process.cwd()
    console.log('dev...', cwd)
    const entry = join(cwd, 'src', 'index.ts')

    tsup.build({
      entry: [entry],
      format: 'esm',
      watch: true,
      tsconfig: join(cwd, 'tsconfig.json'),
      onSuccess: async () => {
        console.log('Build success~')
        this.handleBuildSuccess()
      },
    })
  }

  private handleBuildSuccess = async () => {
    const data = getExtensionData()

    const url = 'http://127.0.0.1:8080/api/upsert-extension'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.id,
        name: data.name,
        version: data.version,
        code: data.code,
        commands: JSON.stringify(data.commands),
      }),
    }).then((res) => res.json())

    console.log('result--------:', res)
  }
}

const command = new Command()

export default command
