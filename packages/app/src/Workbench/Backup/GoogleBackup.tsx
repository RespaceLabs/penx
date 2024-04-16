import { Suspense, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { get, set } from 'idb-keyval'
import { Radio, RadioGroup, RadioIndicator, Skeleton } from 'uikit'
import { GOOGLE_DRIVE_BACKUP_INTERVAL } from '@penx/constants'
import { trpc } from '@penx/trpc-client'
import { GoogleOauthButton } from '../RecoveryPhrase/GoogleOauthButton'
import { GoogleBackupConnected } from './GoogleBackupConnected'
import { GoogleVersionRestore } from './GoogleVersionRestore'

function Content() {
  const {
    data: token,
    isLoading,
    refetch,
  } = trpc.google.googleDriveToken.useQuery()
  if (isLoading) {
    return <Skeleton h-56 w-280 roundedXL></Skeleton>
  }

  if (!token?.access_token) {
    return (
      <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
        <GoogleOauthButton />
      </Suspense>
    )
  }

  return <GoogleBackupConnected data={token} refetch={refetch} />
}

export function BackupInterval() {
  const [interval, setInterval] = useState<string>('')
  useEffect(() => {
    get(GOOGLE_DRIVE_BACKUP_INTERVAL).then((v) => {
      setInterval(v || '30m')
    })
  }, [])
  return (
    <Box relative column gap6>
      <Box>
        <Box heading2>Backup interval</Box>
        <Box mb1>
          <RadioGroup
            toCenterY
            w-100p
            gap6
            value={interval}
            onChange={(v: string) => {
              setInterval(v)
              set(GOOGLE_DRIVE_BACKUP_INTERVAL, v)
            }}
          >
            <Radio value="10m">
              <RadioIndicator />
              <Box>10 minutes</Box>
            </Radio>
            <Radio value={'30m'}>
              <RadioIndicator />
              <Box>30 minutes</Box>
            </Radio>

            <Radio value={'1h'}>
              <RadioIndicator />
              <Box>1 hours</Box>
            </Radio>

            <Radio value={'4h'}>
              <RadioIndicator />
              <Box>4 hours</Box>
            </Radio>
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  )
}

export function GoogleBackup() {
  return (
    <Box relative column gap6>
      <Box>
        <Box mb4 fontSemibold text={[24, 24]}>
          Google Drive backup
        </Box>
        <Box gray600 mb1 textSM gray400>
          In PenX, one of most important concept is owning your data. you can
          use Google Drive to backup your data.
        </Box>
      </Box>
      <BackupInterval />
      {/* <Content /> */}
      <GoogleVersionRestore />
    </Box>
  )
}
