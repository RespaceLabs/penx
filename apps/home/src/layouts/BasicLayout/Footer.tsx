import { ReactNode, useEffect, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import Link from 'next/link'
import { Divider } from 'uikit'
import { Logo } from '@penx/widget'
import { StyledLink } from '~/components/StyledLink'
import { Nav } from './Nav'

export function Footer() {
  return (
    <Box mb20>
      <Box toCenterY toBetween w-100p px8 gap20>
        <Logo />
        <Box flex-1 toBetween>
          <FooterBox
            title="Social"
            items={[
              {
                text: 'Twitter',
                to: 'https://twitter.com/coder_zion',
                isExternal: true,
              },
              {
                text: 'Discord',
                to: 'https://discord.gg/nyVpH9njDu',
                isExternal: true,
              },

              {
                text: 'GitHub',
                to: 'https://github.com/penxio/penx',
                isExternal: true,
              },
            ]}
          />
          <FooterBox
            title="Download"
            items={[
              // {
              //   text: 'iOS',
              //   to: '/',
              // },
              // {
              //   text: 'Android',
              //   to: '/',
              // },

              {
                text: 'Mac App',
                to: 'https://github.com/penxio/penx/releases',
                isExternal: true,
              },
              {
                text: 'Windows',
                to: 'https://github.com/penxio/penx/releases',
                isExternal: true,
              },
              {
                text: 'Linux',
                to: 'https://github.com/penxio/penx/releases',
                isExternal: true,
              },
            ]}
          />
          <FooterBox
            title="Abount"
            items={[
              {
                text: 'About us',
                to: '/',
              },

              {
                text: 'Join us',
                to: '/',
              },
              {
                text: 'Blog',
                to: 'https://blog.penx.io/blog/why-build-penx',
                isExternal: true,
              },
            ]}
          />
        </Box>
      </Box>
      <Divider my8 />
      <Box ml8 toCenterY toBetween gap2 textSM>
        <Box toCenterY gap2>
          <StyledLink href="/privacy" gray800 noUnderline>
            <Box gray800 noUnderline>
              Privacy Policy
            </Box>
          </StyledLink>
          <Divider orientation="vertical" h-20 />
          <StyledLink href="/terms" gray800 noUnderline>
            <Box>Terms of Conditions</Box>
          </StyledLink>
        </Box>
        <Box>Penx, All rights reserved.</Box>
      </Box>
    </Box>
  )
}

type NavItem = {
  to: string
  text?: ReactNode
  isExternal?: boolean
}

interface FooterBoxProps extends FowerHTMLProps<'div'> {
  title: string
  items: NavItem[]
}

export function FooterBox({ title, items, ...rest }: FooterBoxProps) {
  return (
    <Box {...rest} column gap6>
      <Box textXL fontBold>
        {title}
      </Box>
      <Box column gap4>
        {items.map((item) => (
          <Box key={item.to}>
            <StyledLink
              href={item.to}
              neutral900
              transitionCommon
              noUnderline
              onClick={(e) => {
                if (item.isExternal) {
                  window.open(item.to)
                }
                e.preventDefault()
                return
              }}
            >
              {item.text}
            </StyledLink>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
