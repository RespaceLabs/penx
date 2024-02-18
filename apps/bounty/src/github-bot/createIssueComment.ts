import { Bounty, prisma } from '@penx/db'
import { getApp } from './getApp'
import { getBountyBody } from './getBountyBody'
import { getClaimBody } from './getClaimBody'
import { Comment, Issue, IssueCommentEvent, Reward } from './types'

// const claimReg = /\/claim\s+#(\d+)\s.*/i
const claimReg = /\/claim\s+#(\d+)\s+(0x[0-9a-fA-F]{40})/
const bountyReg = /^\/bounty(\d+)?(USDT)?(\d+)?(INK)?/i
const logins = ['0xzion']

export async function createIssueComment(event: IssueCommentEvent) {
  const { issue, comment } = event
  console.log('=============isBountyIssue:', isBountyIssue(issue, comment))

  if (isBountyIssue(issue, comment)) {
    console.log('==========comment:', comment)

    const rewards = getRewards(comment.body)
    console.log('======rewards:', rewards)

    if (rewards.length > 0 && logins.includes(comment.user.login)) {
      await handleBounty(issue, rewards)
    }
  }

  if (isClaim(issue, comment)) {
    await handleClaim(issue, comment)
  }

  if (isApprove(issue, comment) && logins.includes(comment.user.login)) {
    await handleApprove(issue, comment)
  }
}

function isBountyIssue(issue: Issue, comment: Comment): boolean {
  return bountyReg.test(comment.body.replaceAll(' ', ''))
}

function isClaim(issue: Issue, comment: Comment): boolean {
  return claimReg.test(comment.body) && Reflect.has(issue, 'pull_request')
}

function isApprove(issue: Issue, comment: Comment): boolean {
  return /^\/approve/.test(comment.body) && Reflect.has(issue, 'pull_request')
}

async function handleBounty(issue: Issue, rewards: Reward[]) {
  const app = await getApp()

  let bounty: Bounty | null

  bounty = await prisma.bounty.findFirst({
    where: { issueUrl: issue.html_url },
  })

  if (!bounty) {
    bounty = await prisma.bounty.create({
      data: {
        title: issue.title,
        issueUrl: issue.html_url,
        rewards,
        status: 'available',
      },
    })

    await app.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner: 'penxio',
      repo: process.env.GITHUB_BOT_TARGET_REPO!,
      issue_number: issue.number,
      labels: Array.from(new Set([...issue.labels, '💎 Bounty'])),
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    })
  } else {
    bounty = await prisma.bounty.update({
      where: { id: bounty.id },
      data: {
        title: issue.title,
        issueUrl: issue.html_url,
        rewards,
        status: 'available',
      },
    })
  }

  await app.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: 'penxio',
      repo: process.env.GITHUB_BOT_TARGET_REPO!,
      issue_number: issue.number,
      body: getBountyBody(bounty, issue),
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    },
  )
}

async function handleClaim(issue: Issue, comment: Comment) {
  // console.log('======event.sender.login:', issue.user.id, comment.body)
  const [_, issueNumber, address] = comment.body.match(claimReg) || []

  const issueUrl = `https://github.com/penxio/${process.env.GITHUB_BOT_TARGET_REPO}/issues/${issueNumber}`

  console.log(
    '=========issueNumber:',
    issueNumber,
    'address:',
    address,
    'issueUrl:',
    issueUrl,
  )

  const bounty = await prisma.bounty.findFirst({ where: { issueUrl } })

  if (!bounty) return

  await prisma.bounty.updateMany({
    where: { id: bounty.id },
    data: {
      prUrl: issue.pull_request.html_url,
      address,
    },
  })

  const app = await getApp()

  await app.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: 'penxio',
      repo: process.env.GITHUB_BOT_TARGET_REPO!,
      issue_number: issue.number,
      body: getClaimBody(bounty.id),
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    },
  )
}

async function handleApprove(issue: Issue, comment: Comment) {
  const bounty = await prisma.bounty.findFirst({
    where: { prUrl: issue.pull_request.html_url },
  })
  // console.log('=======bounty:', bounty)
  if (bounty) {
    await prisma.bounty.update({
      where: { id: bounty.id },
      data: { status: 'claimable' },
    })
  }
}

function getRewards(comment = ''): Reward[] {
  const usdtReg = /\/bounty.*\D(\d+)USDT/i
  const inkReg = /\/bounty.*\D(\d+)INK/i
  let rewards: Reward[] = []
  const usdtRegResult = comment.match(usdtReg)
  if (usdtRegResult) {
    rewards.push({ amount: Number(usdtRegResult[1]), token: 'USDT' })
  }

  const inkRegResult = comment.match(inkReg)
  if (inkRegResult) {
    rewards.push({ amount: Number(inkRegResult[1]), token: 'INK' })
  }

  return rewards
}
