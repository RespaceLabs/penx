import fs from 'fs'
import jetpack from 'fs-jetpack'
import { resolve } from 'path'

export async function iconToString(iconFileName = ''): Promise<string> {
  if (!iconFileName) return ''
  try {
    const cwd = process.cwd()
    const iconPath = resolve(cwd, 'assets', iconFileName)
    if (iconFileName.endsWith('.svg')) {
      return jetpack.read(iconPath, 'utf8') || ''
    } else {
      return fs.readFileSync(iconPath).toString('base64') || ''
    }
  } catch (error) {
    return ''
  }
}
