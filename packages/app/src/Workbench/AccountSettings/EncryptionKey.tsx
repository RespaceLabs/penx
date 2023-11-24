import { FC, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { get, set } from 'idb-keyval'
import { Check, Eye, PencilLine } from 'lucide-react'
import { Button, Input } from 'uikit'
import { uniqueId } from '@penx/unique-id'

interface Props {}

const ENCRYPTION_KEY = 'ENCRYPTION_KEY'

export const EncryptionKey: FC<Props> = () => {
  const [blur, setBlur] = useState(true)
  const [editing, setEditing] = useState(false)
  const [key, setKey] = useState('')

  useEffect(() => {
    get(ENCRYPTION_KEY).then((value) => {
      if (value) return setKey(value)
      setKey(uniqueId())
    })
  }, [])

  return (
    <Box column gap2>
      <Box textLG fontSemibold>
        End-to-End Encryption key
      </Box>
      <Box gray600 leadingNormal textSM>
        The key to encrypt you data, please remember it, and don't forget it!
      </Box>
      <Box bgZinc100 px4 relative rounded2XL toBetween toCenterY gap2 h-60>
        {blur && (
          <Box
            absolute
            top0
            bottom0
            right0
            left0
            style={{ backdropFilter: 'blur(5px)' }}
          />
        )}
        {!editing && <Box flex-1>{key}</Box>}
        {editing && (
          <Input
            flex-1
            value={key}
            onChange={async (e) => {
              setKey(e.target.value)
              await set(ENCRYPTION_KEY, e.target.value)
            }}
          />
        )}

        {editing && (
          <Button
            isSquare
            size="sm"
            variant="light"
            colorScheme="gray500"
            onClick={() => setEditing(!editing)}
          >
            <Check />
          </Button>
        )}

        {!editing && (
          <Button
            isSquare
            size="sm"
            variant="light"
            colorScheme="gray500"
            onClick={() => setEditing(!editing)}
          >
            <PencilLine />
          </Button>
        )}

        <Button
          relative
          isSquare
          size="sm"
          variant="light"
          colorScheme="gray500"
          zIndex-10
          onClick={() => setBlur(!blur)}
        >
          <Eye></Eye>
        </Button>
      </Box>
    </Box>
  )
}
