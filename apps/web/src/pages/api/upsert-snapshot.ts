import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate params
  const input = req.body

  const find = await prisma.snapshot.findUnique({
    where: { spaceId: input.spaceId },
  })

  if (!find) {
    await prisma.snapshot.create({
      data: input,
    })
  } else {
    await prisma.snapshot.update({
      where: { id: find.id },
      data: input,
    })
  }

  res.json({
    ok: true,
  })
}
