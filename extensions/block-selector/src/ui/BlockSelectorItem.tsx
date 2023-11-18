import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Box } from '@fower/react'
import { useStore } from 'stook'

interface BlockSelectorItemProps {
  id: string
  isActive: boolean
  name: string
  description?: string
  icon: any
  onClick: () => void
}

export function BlockSelectorItem({
  id,
  isActive,
  name,
  description,
  icon: Icon,
  onClick,
}: BlockSelectorItemProps) {
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
      py3
      px3
      cursorPointer
      gapX2
      toCenterY
      leadingNone
    >
      <Box toCenter>{Icon && <Icon size={20} />}</Box>
      <Box column gap1>
        <Box textSM black>
          {name}
        </Box>
        <Box textXS gray500>
          {description}
        </Box>
      </Box>
    </Box>
  )
}
