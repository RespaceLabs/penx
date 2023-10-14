import { useEffect } from 'react'
import { tinykeys } from 'tinykeys'

export const HotkeyBinding = () => {
  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      // 'Shift+D': () => {
      //   console.log('ssl......... shift+d')
      // },
      // 'Meta+B': () => {
      //   console.log('META+B')
      // },
    })
    return () => {
      unsubscribe()
    }
  }, [])
  return null
}
