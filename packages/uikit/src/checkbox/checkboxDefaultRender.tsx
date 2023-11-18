import { Box } from '@fower/react'
import { Check } from 'lucide-react'
import { CheckboxStatus } from './types'

export const checkboxDefaultRender = ({
  checked,
  colorScheme,
}: CheckboxStatus & { colorScheme: string }) => {
  const atomicProps: any = {}
  if (!!checked) {
    atomicProps.borderColor = colorScheme
    // atomicProps.bg = colorScheme
    atomicProps.color = colorScheme
  }

  return (
    <Box
      toCenter
      square-16
      rounded-6
      border-1
      borderGray600={!checked}
      {...atomicProps}
    >
      <Check
        size={20}
        style={{
          strokeWidth: '2px',
          display: checked ? 'block' : 'none',
        }}
      />
    </Box>
  )
}
