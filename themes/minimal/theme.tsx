import { Theme } from '@/theme-helper/types'
import { About } from './About'
import { Home } from './Home'
import { HomeLayout } from './HomeLayout'
import { Members } from './Members'
import { Post } from './Post/Post'
import { PostLayout } from './PostLayout'

const theme: Theme = {
  HomeLayout: HomeLayout,
  Home: Home,
  PostLayout: PostLayout,
  Post: Post,
  About: About,
  Members: Members,
}

export default theme
