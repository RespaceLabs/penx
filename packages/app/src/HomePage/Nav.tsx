import { ReactNode } from 'react'
import { Box } from '@fower/react'
import { ExternalLink } from 'lucide-react'
import { IconDiscord } from '@penx/icons'
import { StyledLink } from '../components/StyledLink'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
}

export const Nav = () => {
  const navData: NavItem[] = [
    { text: 'Docs', to: 'https://docs.penx.io/', isExternal: true },
    {
      text: 'Self-hosted',
      to: 'https://docs.penx.io/self-hosted',
      isExternal: true,
    },
    {
      text: 'Feedback',
      to: 'https://github.com/penxio/penx/issues',
      isExternal: true,
    },

    {
      text: 'Whitepaper',
      to: 'https://whitepaper.penx.io/',
      isExternal: true,
    },

    {
      text: (
        <Box
          brand500
          textSM
          fontSemibold
          border
          borderBrand500
          roundedFull
          h-36
          toCenter
          px2
        >
          Get Early Rewards & Bounty Tasks
        </Box>
      ),
      to: 'https://whitepaper.penx.io/bounty',
      isExternal: true,
    },

    {
      icon: <IconDiscord black />,
      to: 'https://discord.gg/nyVpH9njDu',
      isExternal: true,
    },
  ]

  return (
    <Box listNone toCenterY gap6 textBase display={['none', 'flex']}>
      {navData.map((item, i) => {
        if (item.isExternal) {
          return (
            <Box key={i}>
              <Box
                as="a"
                href={item.to}
                target="_blank"
                cursorPointer
                gray600
                toCenterY
                gap1
                brand500--hover
                noUnderline
                transitionCommon
              >
                {item.text && <Box>{item.text}</Box>}
                {!!item.icon && item.icon}
                {/* <Box inlineFlex>
                  <ExternalLink size={16}></ExternalLink>
                </Box> */}
              </Box>
            </Box>
          )
        }

        return (
          <Box key={i}>
            <StyledLink href={item.to} gray600 brand500--hover transitionCommon>
              {item.text}
            </StyledLink>
          </Box>
        )
      })}
    </Box>
  )
}
