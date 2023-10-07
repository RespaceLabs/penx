import { ExtensionContext } from '@penx/extension-typings'
import { SyncPopover } from './SyncPopover'

export function activate(ctx: ExtensionContext) {
  ctx.registerComponent({
    at: 'status_bar',
    component: SyncPopover,
  })

  ctx.defineSettings([
    {
      label: 'GitHub Token',
      name: 'githubToken',
      component: 'Input',
      description: 'Your GitHub token',
    },
    {
      label: 'Repository',
      name: 'repo',
      component: 'Input',
      description: 'GitHub Repository to sync',
    },
  ])
}
