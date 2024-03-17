import os from 'os'
import { join } from 'path'
import jetpack from 'fs-jetpack'

type User = any // TODO: handle user type

interface Config {
  token: string
  user: User
}

type Env = 'local' | 'dev' | 'prod'

export function getBaseURL(env: Env): string {
  if (env === 'local') return 'http://localhost:3000'
  if (env === 'dev') return 'https://develop.penx.io'
  return 'https://app.penx.io'
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getConfigPath() {
  const fileName = '.penx.json'
  const configPath = join(os.homedir(), fileName)
  return configPath
}

export function writeTokenToLocal(token: string, user: User) {
  const configPath = getConfigPath()
  jetpack.write(configPath, { token, user })
}

export function readConfig(): Config {
  const configPath = getConfigPath()
  if (!jetpack.exists(configPath)) return {} as Config
  return jetpack.read(configPath, 'json') || {}
}
