import { useEffect, useState } from 'react'

import { db } from '@penx/local-db'

export function useDB() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!db.database.connection) {
      db.database.connect().then(() => {
        setConnected(true)
      })
    }
  }, [])
  return {
    connected,
    db,
  }
}
