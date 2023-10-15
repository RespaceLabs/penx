import MarkdownIt from 'markdown-it'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'
import { slateToMarkdown } from '@penx/serializer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const docs = await prisma.doc.findMany()
  res.json({
    ok: true,
    docs,
  })
}
