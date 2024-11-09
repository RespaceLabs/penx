import { Site } from '@plantreexyz/types'

declare global {
  interface Window {
    __SYNCING__: boolean
    __SITE__: Site
    __USER_ID__: string
  }
}
