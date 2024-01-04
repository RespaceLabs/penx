import { ReactNode } from 'react'
import { Box } from '@fower/react'
import { ExternalLink } from 'lucide-react'
import { IconDiscord } from '@penx/icons'
import { StyledLink } from '../components/StyledLink'

type NavItem = {
  text?: string
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
      icon: <IconDiscord black />,
      to: 'https://github.com/penxio/penx/issues',
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
          <Box key={item.text}>
            <StyledLink href={item.to} gray600 brand500--hover transitionCommon>
              {item.text}
            </StyledLink>
          </Box>
        )
      })}
    </Box>
  )
}
