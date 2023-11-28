import { FC, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Check, Eye, PencilLine } from 'lucide-react'
import { Button, Input } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

interface Props {}

export const EncryptionPassword: FC<Props> = () => {
  const [blur, setBlur] = useState(true)
  const [editing, setEditing] = useState(false)
  const { activeSpace } = useSpaces()

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
        {!editing && (
          <Box flex-1>
            {activeSpace.password
              ? activeSpace.password
              : 'Edit to set a password'}
          </Box>
        )}
        {editing && (
          <Input
            flex-1
            // variant="filled"
            placeholder="Set a password"
            value={activeSpace.password}
            onChange={async (e) => {
              await db.updateSpace(activeSpace.id, {
                password: e.target.value,
              })
              const spaces = await db.listSpaces()
              store.space.setSpaces(spaces)
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
