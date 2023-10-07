import { useEffect, useState } from 'react'
import { Box } from '@fower/react'

const kb = 1024
const mb = kb * kb

export function StorageEstimateView() {
  const [loading, setLoading] = useState(true)
  const [used, setUsed] = useState('')
  const [available, setAvailable] = useState('')
  useEffect(() => {
    navigator.storage
      .estimate()
      .then((estimate) => {
        setLoading(false)

        let usedSpace: string
        let availableSpace: string
        const { usage = 0, quota = 0 } = estimate

        if (usage < mb) {
          usedSpace = `${(usage / kb).toFixed(2)} KB`
        } else {
          usedSpace = `${(usage / mb).toFixed(2)} MB`
        }

        if (quota < mb) {
          availableSpace = `${((quota - usage) / kb).toFixed(2)} KB`
        } else {
          availableSpace = `${((quota - usage) / mb).toFixed(2)} MB`
        }

        setUsed(usedSpace)
        setAvailable(availableSpace)
      })
      .catch((error) => {
        //
      })
  }, [])
  if (loading) return null

  return (
    <Box gray400>
      {used} / {available}
    </Box>
  )
}
