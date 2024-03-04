import { Box } from '@fower/react'
import { Plus, Send, SendHorizonal } from 'lucide-react'
import { Input, InputElement, InputGroup } from 'uikit'

export const AddTodoForm = () => {
  return (
    <Box absolute left0 right0 bottom0 bgWhite pb5>
      <Box w={['100%', 680]} mx-auto>
        <InputGroup>
          <InputElement>
            <Box square5 bgBrand500 toCenter roundedFull white>
              <Plus size={14}></Plus>
            </Box>
          </InputElement>
          <Input borderNone shadowPopover placeholder="Create a task" />
          <InputElement gray500>
            <SendHorizonal size={20} />
          </InputElement>
        </InputGroup>
      </Box>
    </Box>
  )
}
