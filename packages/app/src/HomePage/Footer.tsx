import { ReactNode, useEffect, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'uikit'
import { appEmitter } from '../app-emitter'
import { Logo } from '../components/Logo'
import { StyledLink } from '../components/StyledLink'
import { Nav } from './Nav'

export function Footer() {
  return (
    <Box toCenterY toBetween w-100p px8 mb20 gap20>
      <Logo />
      <Box flex-1 toBetween>
        <FooterBox
          title="Social"
          items={[
            {
              text: 'Twitter',
              to: '/',
            },
            {
              text: 'Discord',
              to: '/',
            },

            {
              text: 'GitHub',
              to: '/',
              isExternal: true,
            },
          ]}
        />
        <FooterBox
          title="Download"
          items={[
            {
              text: 'iOS',
              to: '/',
            },
            {
              text: 'Android',
              to: '/',
            },

            {
              text: 'Mac App',
              to: '/',
            },
            {
              text: 'Windows',
              to: '/',
            },
            {
              text: 'Linux',
              to: '/',
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
              to: '/',
              isExternal: true,
            },
          ]}
        />
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
            <StyledLink href={item.to} neutral900 transitionCommon noUnderline>
              {item.text}
            </StyledLink>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
