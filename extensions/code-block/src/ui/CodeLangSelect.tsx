import { useMemo, useState } from 'react'
import { Box } from '@fower/react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import {
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'uikit'
import { useEditorStatic } from '@penx/editor-common'
import { langs } from '../langs'
import { CodeBlockElement } from '../types'

export const CodeLangSelect = ({ element }: { element: CodeBlockElement }) => {
  const editor = useEditorStatic()
  const [lang, setLang] = useState(element.language || 'js')
  const [q, setQ] = useState('')
  const allKeys = Object.keys(langs)

  const keys = useMemo(() => {
    if (!q) return allKeys
    return allKeys.filter((key) => key.includes(q) || langs[key].includes(q))
  }, [q, allKeys])

  function selectLang(value: string) {
    setLang(value)
    setQ('')
    const path = ReactEditor.findPath(editor, element)
    Transforms.setNodes<CodeBlockElement>(
      editor,
      { language: value },
      { at: path },
    )
  }

  return (
    <Select value={lang} onChange={selectLang}>
      <SelectTrigger h-20 bgGray200--hover rounded px-6 gray400 textSM>
        <SelectValue leadingNone></SelectValue>
        <SelectIcon size={12} />
      </SelectTrigger>
      <SelectContent w-240 useTriggerWidth={false} maxH-400 overflowAuto>
        <Box p2 sticky top0 bgWhite>
          <Input size="sm" value={q} onChange={(e) => setQ(e.target.value)} />
        </Box>
        {keys.map((key) => (
          <SelectItem key={key} value={key}>
            {langs[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
