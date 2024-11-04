import { PenxEditor } from '@/lib/editor-common'
import { getCurrentPath } from '@/lib/editor-queries'
import { db } from '@/lib/local-db'
import { store } from '@/store'
import { Editor, Element, Transforms } from 'slate'
import { isFileContainer, isImageElement } from './guard'

export const withImage = (editor: PenxEditor) => {
  const { insertData, normalizeNode } = editor
  editor.insertData = async (dataTransfer: DataTransfer) => {
    const { files } = dataTransfer

    const path = getCurrentPath(editor)!
    if (files && files.length) {
      const file = files[0]

      const [mime] = file.type.split('/')
      if (mime !== 'image') return insertData(dataTransfer)

      // const spaces = store.get(spacesAtom)
      // const fileInfo = await db.createFile({
      //   spaceId: activeSpace.id,
      //   value: file,
      // })

      // Transforms.insertNodes(
      //   editor,
      //   {
      //     type: ELEMENT_IMG,
      //     fileId: fileInfo.id,
      //     mime: file.type,
      //     children: [{ text: '' }],
      //   } as ImageElement,
      //   { at: path },
      // )
      return
    }
    insertData(dataTransfer)
  }

  editor.normalizeNode = ([node, path]) => {
    if (Element.isElement(node) && isFileContainer(node)) {
      if (!isImageElement(node.children[0])) {
        Transforms.unwrapNodes(editor, { at: path })
        return
      }
    }

    normalizeNode([node, path])
  }

  return editor
}
