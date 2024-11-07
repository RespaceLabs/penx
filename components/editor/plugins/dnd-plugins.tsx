'use client'

import { uniqueId } from '@/lib/unique-id'
import { DndPlugin } from '@udecode/plate-dnd'
import { ImagePlugin } from '@udecode/plate-media/react'
import { NodeIdPlugin } from '@udecode/plate-node-id'

export const dndPlugins = [
  NodeIdPlugin.configure({
    options: {
      idCreator: uniqueId,
    },
  }),
  DndPlugin.configure({
    options: {
      enableScroller: true,
      onDropFiles: ({ dragItem, editor, target }) => {
        editor
          .getTransforms(ImagePlugin)
          .insert.imageFromFiles(dragItem.files, {
            at: target,
            nextBlock: false,
          })
      },
    },
  }),
] as const
