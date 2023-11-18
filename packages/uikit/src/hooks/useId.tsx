import React from 'react'
import { useSafeLayoutEffect } from './useSafeLayoutEffect'

let handoffComplete = false
let id = 0
const genId = () => ++id

/**
 * React hook to generate unique id
 *
 * @param idProp the external id passed from the user
 * @param prefix prefix to append before the id
 */
export function useId(idProp?: string, prefix?: string): string {
  const initialId = idProp || (handoffComplete ? genId() : null)
  const [uid, setUid] = React.useState(initialId)

  useSafeLayoutEffect(() => {
    if (uid === null) setUid(genId())
  }, [])

  React.useEffect(() => {
    if (handoffComplete === false) {
      handoffComplete = true
    }
  }, [])

  const id = uid != null ? uid.toString() : undefined
  return (prefix ? `${prefix}-${id}` : id) as string
}
