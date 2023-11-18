import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // const snapshot = await prisma.snapshot.deleteMany({
    //   // where: { spaceId: 'eTFbK_zv0ZXh8Edf2clGl' },
    // })

    const snapshot = await prisma.user.deleteMany({
      // where: { spaceId: 'eTFbK_zv0ZXh8Edf2clGl' },
    })

    res.json(snapshot)
  } catch (error) {
    throw error
  }
}
