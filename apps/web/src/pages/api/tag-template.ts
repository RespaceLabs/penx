import Redis from 'ioredis'
import ky from 'ky'
import { NextApiRequest, NextApiResponse } from 'next'

const redis = new Redis(process.env.REDIS_URL!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const name = req.query.name as string

    const str = await redis.get(name)

    if (str) {
      console.log('cache hit........')
      return res.json(JSON.parse(str))
    }

    const tpl = await ky
      .get(
        `https://raw.githubusercontent.com/penxio/tag-templates/main/templates/${name}.json`,
      )
      .json()

    await redis.set(name, JSON.stringify(tpl))

    res.json(tpl)
  } catch (error) {
    res.json(null)
  }
}
