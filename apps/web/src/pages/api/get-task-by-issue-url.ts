import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return res.status(200).json({})
  }

  const url = req.body.url

  const task = await prisma.task.findFirst({
    where: {
      issueUrl: url,
    },
  })

  if (!task) {
    res.json({
      ok: false,
      data: null,
    })
  } else {
    res.json({
      ok: false,
      data: task,
    })
  }
}
