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
    atomicProps.bg = colorScheme
  }
  return (
    <Box toCenter square-16 border-2 borderGray600={!checked} {...atomicProps}>
      <Check
        size={20}
        style={{
          display: checked ? 'block' : 'none',
        }}
      />
    </Box>
  )
}
