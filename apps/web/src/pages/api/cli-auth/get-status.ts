import { NextApiRequest, NextApiResponse } from 'next'
import { getCliLoginStatus } from '~/common/getCliLoginStatus'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    throw new Error('Method not allowed')
  }

  const token = req.query.token as string
  if (!token) throw new Error('No token provided')
  res.json(await getCliLoginStatus(token))
}
