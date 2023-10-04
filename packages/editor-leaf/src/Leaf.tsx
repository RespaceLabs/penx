import { Box } from '@fower/react'
import { RenderLeafProps } from 'slate-react'
import { CustomText } from './types'

export const Leaf = (p: RenderLeafProps) => {
  let { attributes, children } = p
  const leaf = p.leaf as CustomText
  const { text, ...rest } = leaf
  const className = Object.keys(rest).join(' ')

  const sharedProps = {
    ...attributes,
    className,
  }

  if (leaf.bold) {
    children = <strong {...sharedProps}>{children}</strong>
  }

  if (leaf.italic) {
    children = <em {...sharedProps}>{children}</em>
  }

  if (leaf.underline) {
    children = <u {...sharedProps}>{children}</u>
  }

  if (leaf.strike_through) {
    children = <del {...sharedProps}>{children}</del>
  }

  if (leaf.superscript) {
    children = <sup {...sharedProps}>{children}</sup>
  }

  if (leaf.subscript) {
    children = <sub {...sharedProps}>{children}</sub>
  }

  if (leaf.subscript) {
    children = <sub {...sharedProps}>{children}</sub>
  }

  if (leaf.highlight) {
    children = (
      <Box as="span" {...sharedProps} bgYellow100>
        {children}
      </Box>
    )
  }

  if (leaf.code) {
    children = (
      <Box
        as="code"
        bgGray100
        red500
        text="85%"
        rounded
        px1
        py-4
        {...sharedProps}
        className={className}
      >
        {children}
      </Box>
    )
  }

  return <span {...sharedProps}>{children}</span>
}
