import { memo, useState } from 'react'
import { Box } from '@fower/react'
import { Hash, Send, SendHorizonal } from 'lucide-react'
import { Button, Input, InputElement, InputGroup } from 'uikit'
import { store } from '@penx/store'

export const AddTodoForm = memo(function AddTodoForm() {
  const [value, setValue] = useState('')
  function addTodo() {
    store.node.addTodo(value)
    setValue('')
  }
  return (
    <Box
      absolute
      left0
      right0
      bottom0
      // bgWhite
      bgTransparent
      pb5
      display={['none', 'none', 'flex']}
    >
      <Box w={['100%', 680]} mx-auto>
        <InputGroup>
          {/* <InputElement>
            <Box square5 bgBrand500 toCenter roundedFull white>
              <Hash size={14}></Hash>
            </Box>
          </InputElement> */}
          <Input
            size="lg"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            textBase
            borderNone
            shadowPopover
            placeholder="Create a task"
            onKeyDown={(e) => {
              e.key === 'Enter' && addTodo()
            }}
          />
          <InputElement gray500>
            <Button
              isSquare
              variant="ghost"
              colorScheme="gray900"
              onClick={addTodo}
            >
              <SendHorizonal size={20} />
            </Button>
          </InputElement>
        </InputGroup>
      </Box>
    </Box>
  )
})
