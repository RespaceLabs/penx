import { Box } from '@fower/react'
import { Moon, Sun } from 'lucide-react'
import { useMode } from './useMode'

export const ModeToggle = () => {
  const { mode, setMode } = useMode()

  function toggleMode() {
    if (mode === 'dark') {
      setMode('light')
    } else {
      setMode('dark')
    }
  }

  return (
    <Box
      flexShrink-0
      onClick={toggleMode}
      roundedFull
      bgGray200--hover
      square7
      cursorPointer
      toCenter
    >
      {mode === 'dark' && <Moon size={20} />}
      {mode !== 'dark' && <Sun size={20} />}
    </Box>
  )
}
