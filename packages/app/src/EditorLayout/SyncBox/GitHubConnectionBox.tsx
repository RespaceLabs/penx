import { Box, FowerHTMLProps } from '@fower/react'
import { Skeleton } from 'uikit'

interface Props extends FowerHTMLProps<'div'> {
  isLoading: boolean
}

export function GithubConnectionBox({ children, isLoading, ...rest }: Props) {
  return (
    <Box {...rest}>
      {isLoading && (
        <Box toBetween>
          <Box toCenter gap2>
            <Skeleton square8 roundedFull />
            <Skeleton h-32 w-100 />
          </Box>
          <Skeleton w-100 h-42 rounded2XL />
        </Box>
      )}

      {!isLoading && <Box>{children}</Box>}
    </Box>
  )
}
