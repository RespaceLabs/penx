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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'uikit'
import { SyncStatus } from '@penx/constants'
import { useSpaces, useSyncStatus, useUser } from '@penx/hooks'
import { IconPull, IconPush } from '@penx/icons'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { SyncService } from '@penx/sync'

interface Props {}

export const SyncPopover: FC<Props> = () => {
  const user = useUser()
  const { isSyncing, isPulling, isFailed, isNormal, status, setStatus } =
    useSyncStatus()
  const { activeSpace } = useSpaces()

  async function pushToGitHub(isAll = false) {
    try {
      setStatus(SyncStatus.PUSHING)
      const mnemonic = store.user.getMnemonic()
      // console.log('=========mnemonic:', mnemonic)
      const s = await SyncService.init(activeSpace.raw, user)
      if (isAll) {
        await s.pushAll()
      } else {
        await s.push()
      }

      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      console.log('==========github push error:', error)
      setStatus(SyncStatus.PUSH_FAILED)
    }
  }

  const triggerJSX = (
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
  )

  if (!user.repo) return triggerJSX

  return (
    <Popover placement="top-start">
      <PopoverTrigger asChild>{triggerJSX}</PopoverTrigger>
      <PopoverContent w-200 gray600>
        {({ close }) => (
          <>
            {/* <MenuItem
              h-36
              px0
              py0
              toCenterY
              toBetween
              onClick={async (e) => {
                e.stopPropagation()
                store.sync.pushToCloud()
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
            </MenuItem> */}

            {/* <Divider /> */}

            {/* <MenuItem
              h-36
              px0
              py0
              toCenterY
              onClick={async (e) => {
                e.stopPropagation()
                store.sync.pullFromCloud()
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
            </MenuItem> */}

            {/* <Divider /> */}

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
                      <Box>Push diff to GitHub</Box>
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

            <MenuItem
              h-36
              px0
              py0
              toCenterY
              onClick={async () => {
                close()
                pushToGitHub(true)
              }}
            >
              <Tooltip placement="right">
                <TooltipTrigger asChild>
                  <Box h-100p w-100p toCenterY toBetween px3>
                    <Box toCenterY gap2>
                      <IconPush square-18 />
                      <Box>Push all to GitHub</Box>
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
