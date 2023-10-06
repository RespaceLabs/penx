import { Box } from '@fower/react'
import { Button, toast } from 'uikit'
import type { RouterOutputs } from '@penx/api'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'

interface ExtensionItemProps {
  extension: RouterOutputs['extension']['all'][0]
}
export function ExtensionItem({ extension }: ExtensionItemProps) {
  console.log('extension:', extension)

  const { activeSpace } = useSpaces()

  async function install() {
    await db.installExtension({
      spaceId: activeSpace.id,
      code: extension.code,
      manifest: {
        id: extension.uniqueId,
        name: extension.name,
        version: extension.version,
      },
    })

    toast.success(`Extension ${extension.name} installed`)
  }

  return (
    <Box w-200 bgGray100 p5 roundedLG column gap2>
      <Box textLG fontBold>
        {extension.name}
      </Box>
      <Box>
        <Button size="sm" onClick={install}>
          Install
        </Button>
      </Box>
    </Box>
  )
}
