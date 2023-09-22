import { Editor } from 'slate'
import { toggleMark } from '../components/HoveringToolbar/utils'

export function useOnDOMBeforeInput(editor: Editor) {
  return (event: InputEvent) => {
    // event.preventDefault()
    switch (event.inputType) {
      case 'formatBold':
        return toggleMark(editor, 'bold')
      case 'formatItalic':
        return toggleMark(editor, 'italic')
      case 'formatUnderline':
        return toggleMark(editor, 'underlined')
    }
  }
}
