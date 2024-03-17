import { NextApiRequest, NextApiResponse } from 'next'
import { CliLoginStatus } from '@penx/constants'
import { prisma } from '@penx/db'
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

  const { userId, status } = await getCliLoginStatus(token)

  if (!userId || status !== CliLoginStatus.CONFIRMED) {
    throw new Error('Please confirm login in web')
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  })

  res.json(user)
}
