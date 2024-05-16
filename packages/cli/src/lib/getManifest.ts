import jetpack from 'fs-jetpack'
import { join } from 'path'
import { Manifest } from '../types/index'

export function getManifest(): Manifest {
  const manifestPath = join(process.cwd(), 'manifest.json')
  const manifest = jetpack.read(manifestPath, 'json')
  return manifest
}
