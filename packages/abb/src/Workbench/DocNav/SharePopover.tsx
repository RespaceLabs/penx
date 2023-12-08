import { Box } from '@fower/react'
import { Copy, Share2 } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger, toast } from 'uikit'
import { useNodeContext } from '@penx/hooks'
import { useCopyToClipboard } from '@penx/shared'

export const SharePopover = () => {
  const { node } = useNodeContext()

  const { copy } = useCopyToClipboard()

  if (!node?.id) return null

  const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL + `/share/${node?.id}`
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <Share2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent w-360 p4 column gap2>
        <Box fontBold textLG mb2>
          {node.title}
        </Box>

        <Box>Share URL</Box>
        <Box toBetween toCenterY bgGray100 rounded px1 py1 gap1>
          <Box flex-1 w={'calc(100% - 32px)'} truncate gray500>
            {url}
          </Box>
          <Button
            size={28}
            isSquare
            colorScheme="gray600"
            variant="ghost"
            gray400
            onClick={() => {
              copy(url)
              toast.info('Copied to clipboard')
            }}
          >
            <Copy />
          </Button>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
