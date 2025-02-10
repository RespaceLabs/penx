'use client'

import { useState } from 'react'
import { Command } from 'cmdk'
import { Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { addPostTag, removePostTag, usePost } from '@/lib/hooks/usePost'
import { useSiteTags } from '@/lib/hooks/useSiteTags'
import { trpc } from '@/lib/trpc'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

export function Tags() {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { post } = usePost()
  const { data: tags = [], refetch } = useSiteTags()

  const { mutateAsync } = trpc.tag.create.useMutation()
  const { mutateAsync: deletePostTag } = trpc.tag.deletePostTag.useMutation()
  const { mutateAsync: addTag } = trpc.tag.add.useMutation()

  return (
    <div className="flex items-center gap-2">
      {post.postTags.map((item) => (
        <Badge
          variant="secondary"
          key={item.id}
          className="rounded-full relative gap-1 text-xs"
          onClick={async () => {
            try {
              removePostTag(item)
              await deletePostTag(item.id)
            } catch (error) {
              toast.error(extractErrorMessage(error))
            }
          }}
        >
          <div>{item.tag?.name}</div>
          <div className="inline-flex w-5 h-5 rounded-full hover:bg-foreground/50 hover:text-background items-center justify-center transition-colors cursor-pointer">
            <XIcon size={14} />
          </div>
        </Badge>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild className="gap-0">
          <Button
            size="xs"
            variant="outline"
            className="rounded-full gap-1 text-foreground/500 text-xs h-7 px-2"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16}></Plus>
            <div>Add tag</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="p-0 w-48">
          <Command label="">
            <CommandInput
              autoFocus
              className=""
              placeholder="Find or create option"
              value={search}
              onValueChange={(v) => {
                setSearch(v)
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  try {
                    if (!search.trim()) return
                    const postTag = await mutateAsync({
                      postId: post.id,
                      name: search,
                    })

                    addPostTag(postTag)
                    refetch()
                    setIsOpen(false)
                    setSearch('')
                  } catch (error) {
                    const msg = extractErrorMessage(error)
                    toast.error(msg || 'Error adding tag')
                  }
                }
              }}
            />
            <Command.List>
              <Command.Empty className="text-center text-foreground/40 py-2 text-sm">
                Press Enter to add a tag.
              </Command.Empty>
              <CommandGroup heading={''}>
                {tags.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
                      const some = post.postTags.some(
                        (postTag) => postTag.tag.id === item.id,
                      )
                      if (some) {
                        setIsOpen(false)
                        setSearch('')
                        return
                      }
                      try {
                        const postTag = await addTag({
                          postId: post.id,
                          tagId: item.id,
                        })
                        addPostTag(postTag)
                        setIsOpen(false)
                        setSearch('')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }}
                    className="cursor-pointer py-2"
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
