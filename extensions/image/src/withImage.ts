import { Editor, Transforms } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { getCurrentPath } from '@penx/editor-queries'
import { db } from '@penx/local-db'
import { spacesAtom, store } from '@penx/store'
import { ELEMENT_IMG, ImageElement } from './types'

export const withImage = (editor: PenxEditor) => {
  const { insertData } = editor
  editor.insertData = async (dataTransfer: DataTransfer) => {
    const { files } = dataTransfer

    const path = getCurrentPath(editor)!
    if (files && files.length) {
      const file = files[0]

      const [mime] = file.type.split('/')
      if (mime !== 'image') return insertData(dataTransfer)

      const spaces = store.get(spacesAtom)
      const activeSpace = spaces.find((space) => space.isActive)!
      const fileInfo = await db.createFile({
        spaceId: activeSpace.id,
        value: file,
      })

      Transforms.insertNodes(
        editor,
        {
          type: ELEMENT_IMG,
          fileId: fileInfo.id,
          mime: file.type,
          children: [{ text: '' }],
        } as ImageElement,
        { at: path },
      )
      return
    }
    insertData(dataTransfer)
  }

  return editor
}
