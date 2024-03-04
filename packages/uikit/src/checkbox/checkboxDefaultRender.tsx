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
    atomicProps.color = 'white'
  }

  return (
    <Box
      toCenter
      square-18
      roundedFull
      border-1
      borderGray400={!checked}
      bgBrand500={checked}
      // white={}
      {...atomicProps}
    >
      <Check
        size={12}
        style={{
          strokeWidth: '2px',
          display: checked ? 'block' : 'none',
        }}
      />
    </Box>
  )
}
