'use client'

import React, { useState } from 'react'
import { bgColorMaps } from '@/lib/color-helper'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { cn, withRef } from '@udecode/cn'
import { getTagOnSelectItem } from '../editor/plugins/tag-plugin/lib/getTagOnSelectItem'
import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox'
import { PlateElement } from './plate-element'

const onSelectItem = getTagOnSelectItem()

export const TagInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props
    const [search, setSearch] = useState('')
    const { data = [] } = useDatabases()

    return (
      <PlateElement
        ref={ref}
        as="span"
        data-slate-value={element.value}
        {...props}
      >
        <InlineCombobox
          value={search}
          element={element}
          setValue={setSearch}
          showTrigger
          trigger="#"
        >
          <span
            className={cn(
              'inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2',
              className,
            )}
          >
            <InlineComboboxInput />
          </span>

          <InlineComboboxContent className="my-1.5">
            <InlineComboboxEmpty>No results</InlineComboboxEmpty>

            <InlineComboboxGroup>
              {data.map((item) => (
                <InlineComboboxItem
                  key={item.id}
                  className="flex items-center gap-2 h-9"
                  value={item.name!}
                  onClick={() =>
                    onSelectItem(
                      editor,
                      {
                        key: item.id,
                        text: item.name!,
                        color: item.color!,
                        databaseId: item.id,
                        element,
                      },
                      search,
                    )
                  }
                >
                  <span
                    className={cn(
                      'h-5 w-5 rounded-full flex items-center justify-center text-background text-sm',
                      bgColorMaps[item.color!] || 'bg-foreground/50',
                    )}
                  >
                    #
                  </span>
                  <span className="text-base font-medium">{item.name}</span>
                </InlineComboboxItem>
              ))}
            </InlineComboboxGroup>
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    )
  },
)
