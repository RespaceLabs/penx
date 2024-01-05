import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

type SpaceInfo = {
  spaceId: string
  userId: string
  lastModifiedTime: number
}

type BodyInput = {
  token: string
}

const redis = new Redis(process.env.REDIS_URL!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    throw new Error('Method not allowed')
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const data = `data: ${JSON.stringify({})}\n\n`
  res.write(data)

  const body = (req.body || {}) as BodyInput

  console.log('==========body:', body)

  if (!body?.token) {
    res.end()
    return
  }

  let userId = ''

  try {
    const decoded = jwt.verify(body.token, process.env.NEXTAUTH_SECRET!)
    userId = decoded.sub as string
  } catch (error) {
    res.end()
    return
  }
  //

  // console.log("=============userId:", userId);

  const CHANNEL = 'NODES_SYNCED'

  redis.subscribe(CHANNEL, (_, count) => {
    console.log('subscribe count.........:', count)
  })

  redis.on('message', async (channel, msg) => {
    console.log('=========msg:', msg)
    if (!msg) return

    try {
      const spaceInfo: SpaceInfo = JSON.parse(msg)
      if (spaceInfo.userId === userId) {
        const data = `data: ${msg}\n\n`
        res.write(data)
      }
    } catch (error) {
      res.end()
    }
  })

  req.on('close', () => {
    // console.log("close=========");
    // TODO: how to unsubscribe?
    // redis.unsubscribe(CHANNEL);
  })
}
