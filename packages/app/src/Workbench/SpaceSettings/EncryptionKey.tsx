import { FC, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Check, Eye, PencilLine } from 'lucide-react'
import { Button, Input } from 'uikit'
import { getPassword, setPassword } from '@penx/encryption'

interface Props {}

export const EncryptionKey: FC<Props> = () => {
  const [blur, setBlur] = useState(true)
  const [editing, setEditing] = useState(false)
  const [key, setKey] = useState('')

  useEffect(() => {
    getPassword().then((value) => {
      if (value) return setKey(value)
    })
  }, [])

  return (
    <Box column gap2 maxW-600>
      <Box textLG fontMedium>
        End-to-End Encryption password
      </Box>
      <Box gray600 leadingNormal textSM>
        The password to encrypt you data, please remember it, and don't forget
        it!
      </Box>

      <Box gray400 leadingNormal textSM>
        Please set your encryption your below.
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
        {!editing && <Box flex-1>{key ? key : 'Edit to set a password'}</Box>}
        {editing && (
          <Input
            flex-1
            // variant="filled"
            placeholder="Set a password"
            value={key}
            onChange={async (e) => {
              setKey(e.target.value)
              await setPassword(e.target.value)
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
