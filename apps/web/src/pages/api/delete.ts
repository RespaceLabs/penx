import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const users = await prisma.user.findMany()

    res.json(users)
  } catch (error) {
    throw error
  }
}
