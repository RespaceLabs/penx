import { Popover, PopoverContent } from 'uikit'
import { CreateSpaceModal } from '../../CreateSpaceModal/CreateSpaceModal'
import { RestoreFromGitHubModal } from '../../RestoreFromGitHubModal/RestoreFromGitHubModal'
import { SpacePopoverContent } from './SpacePopoverContent'
import { SpacePopoverTrigger } from './SpacePopoverTrigger'

export const SpacePopover = () => {
  return (
    <>
      <CreateSpaceModal />
      <RestoreFromGitHubModal />
      <Popover placement="bottom-start" offset={{ crossAxis: 6 }}>
        <SpacePopoverTrigger />
        <PopoverContent w-300>
          <SpacePopoverContent />
        </PopoverContent>
      </Popover>
    </>
  )
}
