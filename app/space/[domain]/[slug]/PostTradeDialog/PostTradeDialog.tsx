'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostWithSpace } from '@/hooks/usePost'
import { Space } from '@prisma/client'
import { AvatarList } from './AvatarList'
import { HolderList } from './HolderList'
import { PostTradeList } from './PostTradeList'

interface Props {
  space: Space
  post: PostWithSpace
}
export function PostTradeModal({ space, post }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <AvatarList post={post} />
      </DialogTrigger>
      <DialogContent className="w-[700px] sm:w-[740px] min-h-[60vh]">
        <DialogHeader>
          <DialogTitle># {post.creationId}</DialogTitle>

          <Tabs defaultValue="keys" className="">
            <TabsList className="flex w-full">
              <TabsTrigger value="keys">Key Holders</TabsTrigger>
              <TabsTrigger value="trades">Trade History</TabsTrigger>
            </TabsList>
            <div className="pt-5">
              <TabsContent value="keys">
                <HolderList space={space} post={post} />
              </TabsContent>
              <TabsContent value="trades">
                <PostTradeList post={post} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
