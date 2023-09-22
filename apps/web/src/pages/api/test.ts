import MarkdownIt from 'markdown-it'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'
import { slateToMarkdown } from '@penx/serializer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const doc = await prisma.doc.findFirstOrThrow({
    where: { slug: 'Siey9aO6zWXC31xJcdY4C' },
  })
  const content = JSON.parse(doc.content)

  const mdStr = slateToMarkdown(content)
  const md = new MarkdownIt()
  const result = md.render(mdStr)

  res.json({
    ok: true,
    result,
  })
}
