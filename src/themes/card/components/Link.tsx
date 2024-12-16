import { AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import type { LinkProps } from 'next/link'

const CustomLink = ({
  href,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  const isProd = process.env.NODE_ENV === 'production'

  if (isInternalLink) {
    // if (isProd) href = href + '.html'
    return <Link className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a
      className="break-words"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
    />
  )
}

export default CustomLink
