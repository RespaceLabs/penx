import { Box } from '@fower/react'
import { Avatar, AvatarImage, Button } from 'uikit'
import { IconDisconnect } from '@penx/icons'
import { api } from '@penx/trpc-client'
import { GoogleDriveConnectedData } from '@penx/types'

interface Props {
  data: GoogleDriveConnectedData
  refetch: () => void
}

export function GoogleBackupConnected({ data, refetch }: Props) {
  return (
    <Box toCenterY maxW-760 gap3>
      <Box toCenterY gap2>
        <Avatar>
          <AvatarImage src={data?.picture || ''} />
        </Avatar>
        <Box>{data.email}</Box>
      </Box>
      <Box>
        <Button
          size={56}
          colorScheme="white"
          onClick={async () => {
            await api.google.disconnectGoogleDrive.mutate()
            refetch()
          }}
        >
          <IconDisconnect />
          <Box column gap1>
            <Box textLG fontBold>
              Disconnect Google drive
            </Box>
            <Box gray400 textXS>
              Disconnect to disable Google drive backup
            </Box>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}
