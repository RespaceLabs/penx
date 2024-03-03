import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return res.json({ ok: false })
  }

  // TODO: handle token

  const spaceId = req.body.spaceId as string
  const count = req.body.count as number

  await prisma.space.update({
    where: { id: spaceId },
    data: { syncedNodesCount: count },
  })

  res.json({
    ok: true,
  })
}
