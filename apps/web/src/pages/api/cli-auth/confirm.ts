import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'
import { CliLoginStatus } from '@penx/constants'

const redis = new Redis(process.env.REDIS_URL!)

const getKey = (cliToken: string) => `cli-login:${cliToken}`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    throw new Error('Method not allowed')
  }

  const value = await redis.get(getKey(req.body.token))

  if (!value) {
    res.json({ status: CliLoginStatus.INIT })
    return
  }

  res.json(JSON.parse(value))
}
