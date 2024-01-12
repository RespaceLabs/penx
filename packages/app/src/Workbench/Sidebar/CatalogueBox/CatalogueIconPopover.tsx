import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import EmojiPicker, { Emoji, EmojiStyle } from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { CatalogueNode } from '@penx/catalogue'
import { useCatalogue } from '@penx/hooks'
import { IconDocument } from '@penx/icons'

interface Props {
  node: CatalogueNode
}

export const CatalogueIconPopover = ({ node }: PropsWithChildren<Props>) => {
  const catalogue = useCatalogue()

  return (
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
              catalogue.updateEmoji(node.id, v.unified)
              close()
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
