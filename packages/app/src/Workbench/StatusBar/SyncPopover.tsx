import React, { FC } from 'react'
import { Box } from '@fower/react'
import { Cloud, Github, RefreshCcw } from 'lucide-react'
import {
  Divider,
  Dot,
  Menu,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'uikit'
import { SyncStatus } from '@penx/constants'
import { useSpaces, useSyncStatus, useUser } from '@penx/hooks'
import { IconPull, IconPush } from '@penx/icons'
import { db } from '@penx/local-db'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { pullFromCloud, SyncService, syncToCloud } from '@penx/sync'

interface Props {}

export const SyncPopover: FC<Props> = () => {
  const user = useUser()
  const { isSyncing, isPulling, isFailed, isNormal, status, setStatus } =
    useSyncStatus()
  const { activeSpace } = useSpaces()

  async function pushToCloud() {
    try {
      setStatus(SyncStatus.PUSHING)

      const isSynced = await syncToCloud()

      if (isSynced) {
        console.log('========isSynced!!!')

        const spaces = await db.listSpaces()
        store.space.setSpaces(spaces)
      }

      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      setStatus(SyncStatus.PUSH_FAILED)
    }
  }

  async function startPullFromCloud() {
    try {
      setStatus(SyncStatus.PULLING)

      await pullFromCloud(activeSpace.raw)

      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      setStatus(SyncStatus.PULL_FAILED)
    }
  }

  async function pushToGitHub() {
    if (!activeSpace) return

    try {
      setStatus(SyncStatus.PUSHING)
      const s = await SyncService.init(activeSpace.raw, user)
      await s.push()

      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      console.log('==========github push error:', error)
      setStatus(SyncStatus.PUSH_FAILED)
    }
  }

  return (
    <Popover placement="top-start">
      <PopoverTrigger asChild>
        <Box gapX2 toCenterY h-100p inlineFlex textSM>
          <Box toCenterY gap1 rounded cursorPointer px2>
            {isSyncing && (
              <>
                <Box animateSpin={isSyncing} inlineFlex>
                  <RefreshCcw size={16} />
                </Box>
                <Box gray400>{isPulling ? 'Pulling' : 'Pushing'}</Box>
              </>
            )}
            {isNormal && (
              <>
                <Dot type="success" />
                <Box gray400>Synced</Box>
              </>
            )}
            {isFailed && (
              <>
                <Dot type="error" />
                {status === SyncStatus.PUSH_FAILED && (
                  <Box gray400>Push failed</Box>
                )}
                {status === SyncStatus.PULL_FAILED && (
                  <Box gray400>Pull failed</Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent w-190 gray600>
        {({ close }) => (
          <>
            <MenuItem
              h-36
              px0
              py0
              toCenterY
              toBetween
              onClick={async (e) => {
                e.stopPropagation()
                pushToCloud()
                close()
              }}
            >
              <Tooltip placement="right">
                <TooltipTrigger asChild>
                  <Box h-100p w-100p toCenterY toBetween px3>
                    <Box toCenterY gap2>
                      <IconPush square-18 />
                      <Box>Push to Cloud</Box>
                    </Box>
                    <Cloud size={16} />
                  </Box>
                </TooltipTrigger>
                <TooltipContent maxW-280 leadingNormal>
                  PenX cloud sync is in early stage, you need to push manually.
                </TooltipContent>
              </Tooltip>
            </MenuItem>
            <Divider />

            <MenuItem
              h-36
              px0
              py0
              toCenterY
              onClick={async (e) => {
                e.stopPropagation()
                startPullFromCloud()
                close()
              }}
            >
              <Tooltip placement="right">
                <TooltipTrigger asChild>
                  <Box h-100p w-100p toCenterY toBetween px3>
                    <Box toCenterY gap2>
                      <IconPull square-18 />
                      <Box>Pull from Cloud</Box>
                    </Box>
                    <Cloud size={16} />
                  </Box>
                </TooltipTrigger>
                <TooltipContent maxW-280 leadingNormal>
                  PenX cloud sync is in early stage, you need to pull manually.
                </TooltipContent>
              </Tooltip>
            </MenuItem>
            <Divider />

            <MenuItem
              h-36
              px0
              py0
              toCenterY
              onClick={async () => {
                close()
                pushToGitHub()
              }}
            >
              <Tooltip placement="right">
                <TooltipTrigger asChild>
                  <Box h-100p w-100p toCenterY toBetween px3>
                    <Box toCenterY gap2>
                      <IconPush square-18 />
                      <Box>Push to GitHub</Box>
                    </Box>
                    <Github size={16} />
                  </Box>
                </TooltipTrigger>
                <TooltipContent maxW-280 leadingNormal>
                  PenX GitHub backup will run every 5 minute, and you run it
                  manually.
                </TooltipContent>
              </Tooltip>
            </MenuItem>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
