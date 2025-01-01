'use client'

import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { bgColorMaps, colorNameMaps, textColorMaps } from '@/lib/color-helper'
import { useMounted } from '@/lib/hooks/use-mounted'
import { transparentize } from '@fower/color-helper'
import { cn, withRef } from '@udecode/cn'
import { getHandler, IS_APPLE } from '@udecode/plate-common'
import { useElement } from '@udecode/plate-common/react'
import { useFocused, useSelected } from 'slate-react'
import type { TTagElement } from '../editor/plugins/tag-plugin/lib/types'
import { TagForm } from '../TagForm/TagForm'
import { PlateElement } from './plate-element'

export const TagElement = withRef<
  typeof PlateElement,
  {
    prefix?: string
    renderLabel?: (mentionable: TTagElement) => string
    onClick?: (mentionNode: any) => void
  }
>(
  (
    {
      children,
      className,
      prefix = '# ',
      renderLabel,
      onClick,
      style,
      ...props
    },
    ref,
  ) => {
    const element = useElement<TTagElement>()
    const selected = useSelected()
    const focused = useFocused()
    const mounted = useMounted()

    return (
      <PlateElement
        ref={ref}
        className={cn(
          'inline-block cursor-pointer rounded-md bg-muted px-1.5 py-0.5 align-baseline text-xs text-white',
          selected && focused && 'ring-2 ring-ring',
          element.children[0].bold === true && 'font-bold',
          element.children[0].italic === true && 'italic',
          element.children[0].underline === true && 'underline',
          textColorMaps[element.color],
          className,
        )}
        style={{
          background: transparentize(colorNameMaps[element.color], 90),
        }}
        // onContextMenu={(e) => {
        //   e.preventDefault()
        // }}
        onClick={getHandler(onClick, element)}
        data-slate-value={element.value}
        contentEditable={false}
        {...props}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            {mounted && IS_APPLE ? (
              // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
              <React.Fragment>
                {children}
                {prefix}
                {renderLabel ? renderLabel(element) : element.value}
              </React.Fragment>
            ) : (
              // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
              <React.Fragment>
                {prefix}
                {renderLabel ? renderLabel(element) : element.value}
                {children}
              </React.Fragment>
            )}
          </ContextMenuTrigger>
          <ContextMenuContent className="w-[320px] p-0">
            <TagForm element={element} />
          </ContextMenuContent>
        </ContextMenu>
      </PlateElement>
    )
  },
)
