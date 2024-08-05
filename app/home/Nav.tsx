import { ReactNode } from 'react'
import Link from 'next/link'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
}

export const Nav = () => {
  const navData: NavItem[] = [
    // {
    //   text: 'Explore',
    //   to: '/',
    // },
  ]

  return (
    <div className="flex items-center gap-6">
      {navData.map((item, i) => {
        if (item.isExternal) {
          return (
            <div key={i}>
              <a
                href={item.to}
                target="_blank"
                className="text-neutral-600 flex items-center gap-1"
              >
                {item.text && <div>{item.text}</div>}
                {!!item.icon && item.icon}
                {/* <div inlineFlex>
                  <ExternalLink size={16}></ExternalLink>
                </div> */}
              </a>
            </div>
          )
        }

        return (
          <div key={i}>
            <Link href={item.to} className="text-neutral-600">
              {item.text}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
