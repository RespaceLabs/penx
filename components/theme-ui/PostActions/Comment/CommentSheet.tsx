import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Post } from '@/lib/theme.types'
import { CommentAmount } from './CommentAmount'
import { CommentContent } from './CommentContent'

interface Props {
  post: Post
}

export function CommentSheet({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <CommentAmount post={post as any} setIsOpen={setIsOpen} />
      <Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <SheetContent className="flex flex-col gap-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Comments</SheetTitle>
          </SheetHeader>
          <CommentContent postId={post.id} />
        </SheetContent>
      </Sheet>
    </>
  )
}
