import { FC, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { get, set } from 'idb-keyval'
import { Check, Eye, PencilLine } from 'lucide-react'
import { Button, Input } from 'uikit'
import { MASTER_PASSWORD } from '@penx/constants'
import { PasswordOnChain } from './PasswordOnChain'
import { useMasterPassword } from './useMasterPassword'

interface Props {}

export const MasterPassword: FC<Props> = () => {
  const [editing, setEditing] = useState(false)
  const { blur, setBlur, masterPassword, setMasterPassword } =
    useMasterPassword()

  useEffect(() => {
    get(MASTER_PASSWORD).then((value) => {
      setMasterPassword({
        blur: !!value,
        value,
      })
    })
  }, [setMasterPassword])

  return (
    <Box column gap8 maxW-600>
      <Box>
        <Box text4XL fontBold textCenter>
          Master password
        </Box>
        <Box textCenter gray600 leadingNormal textSM>
          The password to encrypt you data, please remember it, and don{`'`}t
          forget it!
        </Box>
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
            {masterPassword.value
              ? masterPassword.value
              : 'Edit to set a password'}
          </Box>
        )}
        {editing && (
          <Input
            flex-1
            // variant="filled"
            placeholder="Set a password"
            value={masterPassword.value || ''}
            onChange={async (e) => {
              setMasterPassword({
                ...masterPassword,
                value: e.target.value,
              })
            }}
          />
        )}

        {editing && (
          <Button
            isSquare
            size="sm"
            variant="light"
            colorScheme="gray500"
            onClick={() => {
              // if (!masterPassword.value) return alert('Please set a password')
              setEditing(!editing)
              set(MASTER_PASSWORD, masterPassword.value)
            }}
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
      <Box toCenterY gap2>
        <PasswordOnChain />
      </Box>
    </Box>
  )
}
