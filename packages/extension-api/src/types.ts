type URL = string
type Asset = string
type Icon = string

export type ImageLike = URL | Asset | Icon

export type OpenInBrowser = {
  type: 'OpenInBrowser'
  title?: string
  url: string
}

export type CopyToClipboard = {
  type: 'CopyToClipboard'
  title?: string
  content: string
}

export type ListItemAction = OpenInBrowser | CopyToClipboard

export interface ListItem {
  id?: string

  type?: 'command' | 'list-item' | (string & {})

  title:
    | string
    | {
        value: string
        tooltip?: string | null
      }

  subtitle?:
    | string
    | {
        value?: string | null
        tooltip?: string | null
      }

  icon?:
    | ImageLike
    | {
        value: ImageLike | undefined | null
        tooltip: string
      }

  actions?: ListItemAction[]

  data?: any
}
