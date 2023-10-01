import { useEffect, useRef, useState } from 'react'
import { getState } from 'stook'
import { keyDownEmitter } from './keyDownEmitter'

interface Options {
  onEnter: (cursor: number) => void

  listLength: number

  /**
   * list item ID, for scroll
   */
  listItemIdPrefix: string
}

/**
 * Use keyboard up and down keys to select
 * @param options
 * @returns
 */
export function useKeyDownList(options: Options) {
  const [cursor, setCursor] = useState(0)
  const cursorRef = useRef<number>(cursor)
  const len = options.listLength

  useEffect(() => {
    function scrollByCursor(cursor: number) {
      const id = options.listItemIdPrefix + cursor

      const inView = getState(id)

      if (!inView) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    function onArrowUp() {
      cursorRef.current = !cursor ? len - 1 : (cursor - 1) % len
      setCursor(cursorRef.current)
      scrollByCursor(cursorRef.current)
    }

    function onArrowDown() {
      cursorRef.current = (cursor + 1) % len
      setCursor(cursorRef.current)
      scrollByCursor(cursorRef.current)
    }

    function onEnter() {
      options.onEnter(cursor)
    }

    keyDownEmitter.on('ArrowDown', onArrowDown)
    keyDownEmitter.on('ArrowUp', onArrowUp)
    keyDownEmitter.on('Enter', onEnter)

    return () => {
      keyDownEmitter.off('ArrowDown', onArrowDown)
      keyDownEmitter.off('ArrowUp', onArrowUp)
      keyDownEmitter.off('Enter', onEnter)
    }
  }, [cursor, options, len])

  return {
    cursor,
    setCursor,
  }
}
