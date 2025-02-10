'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Archive, CalendarIcon, Edit3Icon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { PostStatus } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { Post } from '@/lib/hooks/usePost'
import { usePosts } from '@/lib/hooks/usePosts'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { Calendar } from './ui/calendar'

interface PostItemProps {
  status: PostStatus
  post: Post
}

export function PostItem({ post, status }: PostItemProps) {
  const { refetch } = usePosts()
  const isPublished = post.postStatus === PostStatus.PUBLISHED
  const [date, setDate] = useState<Date>(post.publishedAt || new Date())
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          target={isPublished ? '_blank' : '_self'}
          href={isPublished ? `/posts/${post.slug}` : `/~/post?id=${post.id}`}
          className="inline-flex items-center hover:scale-105 transition-transform"
        >
          <div className="text-base font-bold">{post.title || 'Untitled'}</div>
        </Link>
      </div>
      <div className="flex gap-2">
        {post.postTags.map((item) => (
          <Badge key={item.id} variant="outline">
            {item.tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {post.postStatus !== PostStatus.PUBLISHED && (
          <div className="text-sm text-foreground/50">
            <div>{format(new Date(post.updatedAt), 'yyyy-MM-dd')}</div>
          </div>
        )}
        <Link href={`/~/post?id=${post.id}`}>
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 gap-1 opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>Edit</div>
          </Button>
        </Link>

        {status !== PostStatus.ARCHIVED && (
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 gap-1 opacity-60"
            onClick={async () => {
              toast.promise(
                async () => {
                  await api.post.archive.mutate(post.id)
                  await refetch()
                },
                {
                  loading: 'Archive...',
                  success: (data) => {
                    return 'Post archived successfully.'
                  },
                  error: 'Post archived failed.',
                },
              )
            }}
          >
            <Archive size={14}></Archive>
            <div>Archive</div>
          </Button>
        )}

        {status === PostStatus.ARCHIVED && (
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 text-red-500 gap-1 opacity-60"
            onClick={async () => {
              toast.promise(
                async () => {
                  await api.post.delete.mutate(post.id)
                  await refetch()
                },
                {
                  loading: 'Delete...',
                  success: (data) => {
                    return 'Post deleted successfully.'
                  },
                  error: 'Post deleted failed.',
                },
              )
            }}
          >
            <Trash2 size={14}></Trash2>
            <div>Delete</div>
          </Button>
        )}

        {status === PostStatus.PUBLISHED && (
          <div className="text-xs text-foreground/50 flex gap-6">
            <div className="flex items-center gap-1">
              <Switch
                size="sm"
                defaultChecked={!!post.featured}
                onCheckedChange={async (value) => {
                  try {
                    await api.post.updatePublishedPost.mutate({
                      postId: post.id,
                      featured: value,
                    })
                    toast.success('Update successfully!')
                  } catch (error) {
                    toast.error(extractErrorMessage(error))
                  }
                }}
              />
              <div>Featured</div>
            </div>

            <div className="flex items-center gap-1">
              <Switch
                size="sm"
                defaultChecked={!!post.isPopular}
                onCheckedChange={async (value) => {
                  try {
                    await api.post.updatePublishedPost.mutate({
                      postId: post.id,
                      isPopular: value,
                    })
                    toast.success('Update successfully!')
                  } catch (error) {
                    toast.error(extractErrorMessage(error))
                  }
                }}
              />
              <div>Popular</div>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'h-8 justify-start text-xs px-2 rounded-md flex gap-1',
                    !date && 'text-muted-foreground',
                  )}
                  onClick={() => setOpen(!open)}
                >
                  <CalendarIcon size={14} />
                  {date ? (
                    <span>{format(date, 'PPP')}</span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={async (d) => {
                    setOpen(false)

                    if (d) {
                      setDate(d!)
                      try {
                        await api.post.updatePublishedPost.mutate({
                          postId: post.id,
                          publishedAt: d.toString(),
                        })
                        toast.success('Update publish date successfully!')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  )
}

interface PostListProps {
  status: PostStatus
}
export function PostList({ status }: PostListProps) {
  const { data = [], isLoading } = usePosts()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  const posts = data.filter((post) => post.postStatus === status)

  if (!posts.length) {
    return <div className="text-foreground/60">No posts yet.</div>
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => {
        return <PostItem key={post.id} post={post} status={status} />
      })}
    </div>
  )
}
