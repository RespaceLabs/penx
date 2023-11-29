import React, { FC } from 'react'
import { Box } from '@fower/react'
import { RefreshCcw } from 'lucide-react'
import {
  Divider,
  Dot,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from 'uikit'
import { SyncStatus } from '@penx/constants'
import { useSpaces, useSyncStatus, useUser } from '@penx/hooks'
import { IconPull, IconPush } from '@penx/icons'
import { db } from '@penx/local-db'
import { SyncService } from '@penx/service'
import { store } from '@penx/store'
import { syncToCloud } from '@penx/sync'

interface Props {}

export const SyncPopover: FC<Props> = () => {
  const user = useUser()

  const { isSyncing, isPulling, isFailed, isNormal, status, setStatus } =
    useSyncStatus()
  const { activeSpace } = useSpaces()

  async function pushToCloud() {
    if (!activeSpace.isCloud) {
      toast.error('Please select a cloud space')
      return
    }
    try {
      setStatus(SyncStatus.PUSHING)
      // const s = await SyncService.init(space, user)
      // await s.push()

      const isSynced = await syncToCloud()

      if (isSynced) {
        const spaces = await db.listSpaces()
        store.space.setSpaces(spaces)
      }

      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      setStatus(SyncStatus.PUSH_FAILED)
    }
  }

  async function pushToGitHub() {
    if (!activeSpace.isCloud) {
      toast.error('Please select a cloud space')
      return
    }

    if (!activeSpace) return

    try {
      setStatus(SyncStatus.PUSHING)
      const s = await SyncService.init(activeSpace.raw, user)
      await s.push()

      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      setStatus(SyncStatus.PUSH_FAILED)
    }
  }

  return (
    <Popover placement="top-start">
      <PopoverTrigger asChild>
        <Box gapX2 toCenterY h-100p>
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
      <PopoverContent
        bgGray800--T20--dark
        w-260
        toBetween
        gray600
        cursorPointer
        textXS
      >
        {({ close }) => (
          <>
            <Box
              flex-1
              h-36
              toCenter
              gap1
              bgGray100--hover
              onClick={async () => {
                close()
                pushToCloud()
              }}
            >
              <IconPush square-20 />
              <Box>Sync to Cloud</Box>
            </Box>
            <Divider orientation="vertical" h-36 gap1 />
            <Box
              flex-1
              h-36
              toCenter
              bgGray100--hover
              onClick={async () => {
                close()
                pushToGitHub()
              }}
            >
              <IconPush square-20 />
              <Box>Push to GitHub</Box>
            </Box>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
