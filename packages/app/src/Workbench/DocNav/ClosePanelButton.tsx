import { XIcon } from 'lucide-react'
import { Button } from 'uikit'
import { useNodeContext } from '@penx/hooks'
import { store } from '@penx/store'

export const ClosePanelButton = () => {
  const { index } = useNodeContext()
  if (index === 0) return null
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      onClick={() => {
        store.node.closePanel(index)
      }}
    >
      <XIcon />
    </Button>
  )
}
