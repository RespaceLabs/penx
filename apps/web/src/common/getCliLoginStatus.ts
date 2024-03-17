import Redis from 'ioredis'
import { CliLoginStatus } from '@penx/constants'

const redis = new Redis(process.env.REDIS_URL!)

const getKey = (cliToken: string) => `cli-login:${cliToken}`

interface StatusResult {
  userId?: string
  status: CliLoginStatus
}

export async function getCliLoginStatus(token: string): Promise<StatusResult> {
  const value = await redis.get(getKey(token))
  if (!value) return { status: CliLoginStatus.INIT }
  return JSON.parse(value)
}
