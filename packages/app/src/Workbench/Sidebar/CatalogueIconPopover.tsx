import React, { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import EmojiPicker, { Emoji, EmojiStyle } from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { IconDocument } from '@penx/icons'

interface Props {
  node: any
}

export const CatalogueIconPopover = ({ node }: PropsWithChildren<Props>) => {
  if (!node) return null

  return (
    <Box inlineFlex onClick={(e) => e.stopPropagation()}>
      <Popover placement="bottom-start">
        <PopoverTrigger asChild>
          <Box square5 toCenter rounded bgGray200--hover>
            {node.emoji && (
              <Emoji
                unified={node.emoji}
                emojiStyle={EmojiStyle.APPLE}
                size={18}
              />
            )}

            {!node.emoji && <IconDocument square-16 gray400 />}
          </Box>
        </PopoverTrigger>
        <PopoverContent
          animation={false}
          // asChild
          shadowNone
          borderNone
          textSM
          w-400
        >
          {({ close }) => (
            <EmojiPicker
              // width="400"
              onEmojiClick={(v) => {
                // TODO:
                close()
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </Box>
  )
}
