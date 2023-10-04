import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    elementMaps: any
  }

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    // Element: {
    //   id?: string
    // }
  }
}
