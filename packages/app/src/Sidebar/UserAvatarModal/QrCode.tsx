import { FC, useState } from 'react'
import QRCode from 'react-qr-code'
import { Box } from '@fower/react'
import { Eye } from 'lucide-react'
import { useAccount } from 'wagmi'
import { Button } from 'uikit'
import { useUser } from '@penx/hooks'

interface Props {}

export const QrCode: FC<Props> = () => {
  const { address } = useUser()
  const [blur, setBlur] = useState(true)
  const value = JSON.stringify({
    address,
  })
  return (
    <Box column gap2>
      <Box textLG fontSemibold>
        Log in in mobile App
      </Box>
      <Box gray600 leadingNormal textSM>
        "Scan the QR code", Log in in mobile App.
      </Box>
      <Box
        bgZinc100
        inlineFlex
        relative
        rounded2XL
        toBetween
        toCenterY
        w-200
        mt4
        cursorPointer
        onClick={() => setBlur(!blur)}
      >
        {blur && (
          <Box
            absolute
            top0
            bottom0
            right0
            left0
            style={{ backdropFilter: 'blur(8px)' }}
          />
        )}
        <QRCode value={value} style={{ width: 200, height: 200 }} />
      </Box>
    </Box>
  )
}
