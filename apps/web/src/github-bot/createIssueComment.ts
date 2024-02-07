import { prisma } from '@penx/db'
import { getApp } from './getApp'
import { getBountyBody } from './getBountyBody'
import { getClaimBody } from './getClaimBody'
import { Comment, Issue, IssueCommentEvent } from './types'

function isBountyIssue(issue: Issue, comment: Comment): boolean {
  if (!issue.labels?.length) return false
  return (
    issue.labels.some((label) => label.name.includes('Bounty')) &&
    comment.body === '/bounty'
  )
}

const claimReg = /^\/claim\s+#(\d+)\s.*/i

function isClaim(issue: Issue, comment: Comment): boolean {
  return claimReg.test(comment.body) && Reflect.has(issue, 'pull_request')
}

export async function createIssueComment(event: IssueCommentEvent) {
  const { issue, comment } = event
  // console.log('=========issue:', issue)

  if (isClaim(issue, comment)) {
    console.log(
      '======event.sender.login:',
      event.sender.id,
      issue.user.id,
      comment.body,
    )
    const [_, issueNumber] = comment.body.match(claimReg) || []
    console.log('=========issueNumber:', issueNumber)

    const issueUrl = `https://github.com/penxio/${process.env.GITHUB_BOT_TARGET_REPO}/issues/${issueNumber}`

    await prisma.task.updateMany({
      where: { issueUrl },
      data: { prUrl: issue.pull_request.html_url },
    })

    const app = await getApp()

    await app.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: 'penxio',
        repo: process.env.GITHUB_BOT_TARGET_REPO!,
        issue_number: issue.number,
        body: getClaimBody(),
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      },
    )
  }

  console.log('=============isBountyIssue:', isBountyIssue(issue, comment))

  if (isBountyIssue(issue, comment)) {
    const app = await getApp()

    const task = await prisma.task.findFirst({
      where: {
        issueUrl: issue.html_url,
      },
    })

    if (task) {
      console.log('===========task:', task)

      await app.request(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
          owner: 'penxio',
          repo: process.env.GITHUB_BOT_TARGET_REPO!,
          issue_number: issue.number,
          body: getBountyBody(task, issue),
          headers: { 'X-GitHub-Api-Version': '2022-11-28' },
        },
      )
    }
  }
}
