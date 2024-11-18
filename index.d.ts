import { Site } from '@penxio/types'

declare global {
  interface Window {
    __SITE__: Site
    __USER_ID__: string
  }
}
