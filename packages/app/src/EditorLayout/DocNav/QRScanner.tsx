import React, { useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { Html5Qrcode } from 'html5-qrcode'
import { X } from 'lucide-react'

export const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const ref = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    let html5QrcodeScanner = new Html5Qrcode('reader')
    ref.current = html5QrcodeScanner
  }, [])

  const startScanner = async () => {
    console.log('start....')

    // This method will trigger user permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        console.log('device....')

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
              {
                fps: 10, // sets the framerate to 10 frame per second
                qrbox: 250, // sets only 250 X 250 region of viewfinder to
                // scannable, rest shaded.
              },
              (qrCodeMessage) => {
                // do something when code is read. For example:
                alert('success')
                console.log(`QR Code detected: ${qrCodeMessage}`)
              },
              (errorMessage) => {
                // alert('fail')
                // parse error, ideally ignore it. For example:
                console.log(`QR Code no longer in front of camera.`)
              },
            )
            .catch((err) => {
              // Start failed, handle it. For example,
              console.log(`Unable to start scanning, error: ${err}`)
            })
        }
      })
      .catch((err) => {
        console.log('errror:', err)

        // handle err
      })
  }

  function stopScanner() {
    ref
      .current!.stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
        console.log('QR Code scanning stopped.')
      })
      .catch((err) => {
        // Stop failed, handle it.
        console.log('Unable to stop scanning.')
      })
  }

  return (
    <Box>
      <Box bgRed100 px4 fixed zIndex-100 bottom0 left0 right0 toCenter>
        <Box square8 absolute top2 left2 onClick={stopScanner}>
          <X />
        </Box>
        <Box id="reader" ref={videoRef.current} w-300></Box>
      </Box>

      <button onClick={startScanner}>start</button>
    </Box>
  )
}
