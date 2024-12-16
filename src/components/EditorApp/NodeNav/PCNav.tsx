import { PublishPopover } from '@/components/PublishPopover'
import { useRouterName } from '@/hooks'
import { WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { useNodeContext } from '@/lib/node-hooks'
import { PaletteDrawer } from '../PaletteDrawer'
import { Breadcrumb } from './Breadcrumb'
import { FavoriteButton } from './FavoriteButton'
import { MorePopover } from './MorePopover'

export const PCNav = () => {
  const { node } = useNodeContext()
  const name = useRouterName()

  // if (!node) return null
  return (
    <div
      data-tauri-drag-region
      style={{ height: WORKBENCH_NAV_HEIGHT }}
      className="sticky top-0 items-center justify-between hidden sm:inline-flex w-full z-10 bg-background"
    >
      <div className="pl-4">
        {node && <Breadcrumb />}
        {/* {name === 'DATABASES' && <div>Databases</div>}
        {name === 'EXTENSIONS' && <div>Extensions</div>}
        {name === 'ACCOUNT_SETTINGS' && <div>Account settings</div>}
        {name === 'RECOVER_PHRASE' && <div>Recover phrase</div>}
        {name === 'LOCAL_BACKUP' && <div>Local auto backup</div>} */}
      </div>

      <div className="pr-2 flex items-center gap-2">
        {/* {node && <FavoriteButton />} */}
        {/* <PublishPopover /> */}
        {/* <ClosePanelButton /> */}
        {/* <MorePopover /> */}
        <PublishPopover />
      </div>
    </div>
  )
}
