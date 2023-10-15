import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate params
  const spaceId = req.query.spaceId as string

  console.log('=============spaceId:', spaceId)

  try {
    const snapshot = await prisma.snapshot.findFirst({
      where: { spaceId },
    })

    console.log('snapshot:', snapshot)

    if (!snapshot) {
      throw new Error(`Snapshot for "${spaceId}" not found`)
    }

    res.json(snapshot)
  } catch (error) {
    throw error
  }
}
