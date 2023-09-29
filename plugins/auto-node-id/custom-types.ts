import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor &
  ReactEditor & {
    elementMaps: Record<string, any>
  }

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
  }
}
