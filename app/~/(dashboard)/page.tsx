'use client'

import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { NewButton } from '@/components/Navbar/NewButton'
import { PostStatus } from '@/lib/constants'
import { PostList } from '../PostList'

export default function Page() {
  return <PostList status={PostStatus.PUBLISHED} />
}
