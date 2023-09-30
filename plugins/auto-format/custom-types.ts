import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor &
  ReactEditor & {
    id?: string
    type?: string
    elementMaps: Record<string, any>
  }

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor

    Element: {
      id?: string
      type?: string
    }
  }
}
