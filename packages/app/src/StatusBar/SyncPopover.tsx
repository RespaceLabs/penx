import React, { FC } from 'react'
import { Box, css } from '@fower/react'
import { RefreshCcw } from 'lucide-react'
import { useAccount } from 'wagmi'
import { Divider, Dot, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { SyncStatus } from '@penx/constants'
import { useSpaces, useSyncStatus } from '@penx/hooks'
import { IconPull, IconPush } from '@penx/icons'
import { db } from '@penx/local-db'
import { SyncService } from '@penx/service'

interface Props {}

export const SyncPopover: FC<Props> = () => {
  const { address = '' } = useAccount()
  const { isSyncing, isPulling, isFailed, isNormal, status, setStatus } =
    useSyncStatus()

  async function push() {
    const space = await db.getActiveSpace()
    if (!space) return // TODO:
    try {
      setStatus(SyncStatus.PUSHING)
      const s = await SyncService.init(space, address)
      await s.push()
      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      setStatus(SyncStatus.PUSH_FAILED)
    }
  }

  async function pull() {
    const space = await db.getActiveSpace()
    if (!space) return // TODO:
    try {
      setStatus(SyncStatus.PULLING)
      const s = await SyncService.init(space, address)
      await s.pull()
      setStatus(SyncStatus.NORMAL)
    } catch (error) {
      setStatus(SyncStatus.PULL_FAILED)
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
        w-160
        toBetween
        gray600
        cursorPointer
        textSM
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
                push()
              }}
            >
              <IconPush square-20 />
              <Box>Push</Box>
            </Box>
            <Divider orientation="vertical" h-36 gap1 />
            <Box
              flex-1
              h-36
              toCenter
              bgGray100--hover
              onClick={async () => {
                close()
                pull()
              }}
            >
              <IconPull square-20 />
              <Box>Pull</Box>
            </Box>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
