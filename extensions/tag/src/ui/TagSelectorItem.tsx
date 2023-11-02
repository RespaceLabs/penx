import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Box } from '@fower/react'
import { useStore } from 'stook'

interface TagSelectorItemProps {
  id: string
  isActive: boolean
  name: string
  onClick: () => void
}

export function TagSelectorItem({
  id,
  isActive,
  name,
  onClick,
}: TagSelectorItemProps) {
  const [value, setValue] = useStore(id, false)
  const root = document.getElementById('editor-block-selector')
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    root: root ? root : null,
  })

  useEffect(() => {
    if (value !== inView) setValue(inView)
  }, [inView, value, setValue])

  return (
    <Box
      ref={ref}
      id={id}
      onClick={onClick}
      bgGray100--hover
      bgGray100={isActive}
      py2
      px3
      cursorPointer
      gapX2
      toCenterY
      leadingNone
    >
      <Box textBase>{name}</Box>
    </Box>
  )
}
