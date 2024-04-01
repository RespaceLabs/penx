import { Bounty } from '@penx/db'
import { Issue, Reward } from './types'

export function getBountyBody(bounty: Bounty, issue: Issue) {
  const rewards = bounty.rewards as Reward[]
  const bountyStr = rewards.map((r) => `${r.amount} ${r.token}`).join(' and ')

  const attemptCommand = '`/attempt`'
  const claimCommand = `\`/claim #${bounty.id} 0x...\``

  return `
💎 ${bountyStr} bounty 
🙋 If you start working on this, comment ${attemptCommand} along with your implementation plan
👉 To claim this bounty, submit a pull request that includes the text ${claimCommand} somewhere in its body
💯 When the pull request is merged, you can claim the bounty in [/bounties/${bounty.id}](https://bounty.penx.io/bounties/${bounty.id})
🙏 Thank you for contributing to PenX!
  `
}
