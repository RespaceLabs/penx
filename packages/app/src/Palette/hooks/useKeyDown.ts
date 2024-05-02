import { useEffect } from 'react'

export function useKeyDown(fn: () => void) {
  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        fn()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
