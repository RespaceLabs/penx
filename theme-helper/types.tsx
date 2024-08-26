import { PropsWithChildren } from 'react'

export type Space = {
  id: string
  name: string
  description: string
  logo: string | null
  font: string
  image: string | null
  imageBlurhash: string | null
  subdomain: string | null
  customDomain: string | null
  memberCount: number
  sponsorCount: number
  postCount: number
  message404: string | null
  symbolName: string
  spaceAddress: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    id: string
    address: string
    name: string | null
    ensName: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    bio: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export type Post = {
  id: string
  title: string
  description: string
  content: string
  slug: string
  type: any
  gateType: any
  image: string | null
  imageBlurhash: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  spaceId: string
  userId: string
  listId: string | null
  space: Space
}

export interface HomeLayoutProps {
  space: Space
}

export interface PostLayoutProps {
  space: Space
}

export interface HomeProps {
  posts: Post[]
  space: Space
}

export interface PostProps {
  isGated: boolean
  post: Post
}

export type Theme = {
  HomeLayout?: ({
    children,
    space,
  }: PropsWithChildren<HomeLayoutProps>) => JSX.Element
  PostLayout?: ({
    children,
    space,
  }: PropsWithChildren<PostLayoutProps>) => JSX.Element
  Home?: ({ space, posts }: HomeProps) => JSX.Element
  Post?: ({ post, isGated }: PostProps) => JSX.Element
  About?: () => JSX.Element
  Members?: () => JSX.Element
}
