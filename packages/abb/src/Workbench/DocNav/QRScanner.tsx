import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { Html5Qrcode } from 'html5-qrcode'
import { ScanLine, X } from 'lucide-react'
import { modalController } from 'uikit'
import { ModalNames } from '@penx/constants'
import { db, getNewSpace } from '@penx/local-db'
import { User } from '@penx/model'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export const QRScanner: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ref = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    let html5QrcodeScanner = new Html5Qrcode('reader')
    ref.current = html5QrcodeScanner
  }, [])

  async function syncSpaces(address: string) {
    try {
      const data = await trpc.user.byAddress.query({ address })
      const user = new User(data)
      store.setUser(user)

      // const space = await db.getSpace(user.spaceIds[0])

      // if (!space) {
      //   await db.createSpace(
      //     getNewSpace({
      //       id: user.spaceIds[0],
      //       name: 'FOOO', // TODO
      //       isActive: true,
      //     }),
      //     false,
      //   )
      // }

      stopScanner()

      modalController.open(ModalNames.LOGIN_SUCCESS)
    } catch (error) {
      alert('login failed')
    }
  }

  const startScanner = async () => {
    // This method will trigger user permissions
    try {
      setVisible(true)

      const devices = await Html5Qrcode.getCameras()

      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        var cameraId = devices[0].id
        console.log('cameraId:', cameraId, 'devices:', devices)

        ref
          .current!.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: 300 },
            (qrCodeMessage) => {
              const data = JSON.parse(qrCodeMessage)
              console.log(`QR Code detected: ${qrCodeMessage}`)
              syncSpaces(data.address)
            },
            (errorMessage) => {
              // parse error, ideally ignore it. For example:
              console.log(`QR Code no longer in front of camera.`)
            },
          )
          .catch((err) => {
            // Start failed, handle it. For example,
            console.log(`Unable to start scanning, error: ${err}`)
          })
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  function stopScanner() {
    ref
      .current!.stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
        console.log('QR Code scanning stopped.')
        setVisible(false)
      })
      .catch((err) => {
        // Stop failed, handle it.
        console.log('Unable to stop scanning.')
      })
  }

  return (
    <Box>
      <Box
        bgRed100
        px4
        fixed
        zIndex-100
        bottom0
        left0
        right0
        top0
        bgBlack
        toCenter
        display={visible ? 'block' : 'none'}
      >
        <Box
          roundedFull
          square8
          bgWhite
          toCenter
          absolute
          top2
          left2
          onClick={stopScanner}
        >
          <X />
        </Box>
        <Box
          absolute
          top="20%"
          left="50%"
          translateX="-50%"
          id="reader"
          ref={videoRef.current}
          w-300
          h-300
        />
      </Box>

      <Box inlineFlex onClick={startScanner}>
        <ScanLine />
      </Box>
    </Box>
  )
}
