import { NextApiRequest, NextApiResponse } from 'next'
import { createIssueComment } from '~/github-bot/createIssueComment'
import { IssueCommentEvent } from '~/github-bot/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return res.json({ ok: false })
  }

  const event = req.headers['x-github-event']

  if (event === 'issue_comment') {
    console.log('===========issue_comment...')
    const event = req.body as IssueCommentEvent
    await createIssueComment(event)
  }

  res.json({
    hello: 'world',
  })
}
