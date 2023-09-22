import { Editor } from 'slate'

export const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
