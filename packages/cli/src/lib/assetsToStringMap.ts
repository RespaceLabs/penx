import { join } from 'path'
import jetpack from 'fs-jetpack'
import { iconToString } from './iconToString'

export async function assetsToStringMap() {
  const assets: Record<string, string> = {}
  const assetsPath = join(process.cwd(), 'assets')

  if (jetpack.exists(assetsPath)) {
    const files = jetpack.list(assetsPath) || []

    for (const file of files) {
      assets[file] = await iconToString(file)
    }
  }
  return assets
}
