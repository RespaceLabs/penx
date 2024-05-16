import { join } from 'path'
import * as tsup from 'tsup'
import { Options } from 'tsup'
import { getManifest } from './getManifest'

export async function buildExtension(opt: Options) {
  const cwd = process.cwd()
  const manifest = getManifest()

  const entries = manifest.commands.reduce<string[]>((acc, cur) => {
    const entry = join(cwd, 'src', `${cur.name}.ts`)
    return [...acc, entry]
  }, [])

  await tsup.build({
    entry: entries,
    format: ['cjs'],
    watch: false,
    tsconfig: join(cwd, 'tsconfig.json'),
    splitting: true,
    treeshake: true,
    minify: true,
    noExternal: ['penx'],
    ...opt,
  })
}
