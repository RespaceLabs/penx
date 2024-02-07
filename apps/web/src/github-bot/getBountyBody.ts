import { Task } from '@penx/db'
import { Issue } from './types'

export function getBountyBody(task: Task, issue: Issue) {
  const usdReward = task.usdReward > 0 ? ` ${task.usdReward} USD and ` : ''
  return `
💎 ${usdReward}${task.tokenReward} PENX bounty 
🙋 If you start working on this, comment /attempt along with your implementation plan
👉 To claim this bounty, submit a pull request that includes the text /claim #${issue.number} somewhere in its body
💯 When the pull request is merged, you can claim the bounty in https://www.penx.io/tasks
🙏 Thank you for contributing to PenX!
  `
}
