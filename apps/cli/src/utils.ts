import os from 'os'
import { join } from 'path'
import jetpack from 'fs-jetpack'
import { Env, User, Config } from './types'

const PENX_DIRNAME = '.penx'
const CONFIG_FILE_NAME = 'config.json'

const configPath = join(os.homedir(), PENX_DIRNAME, CONFIG_FILE_NAME)

export function getBaseURL(env: Env): string {
  if (env === 'local') return 'http://localhost:3000'
  if (env === 'dev') return 'https://develop.penx.io'
  return 'https://app.penx.io'
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function writeTokenToLocal(env: Env, token: string, user: User) {
  jetpack.write(configPath, { env, token, user })
}

export function writeConfig(config: Partial<Config>) {
  const currentConfig = readConfig()
  jetpack.write(configPath, {
    ...currentConfig,
    ...config,
  })
}

export function readConfig(): Config {
  if (!jetpack.exists(configPath)) return {} as Config
  return jetpack.read(configPath, 'json') || {}
}
