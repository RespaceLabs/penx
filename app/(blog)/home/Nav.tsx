'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
  isToast?: boolean
}

export const Nav = () => {
  const navData: NavItem[] = [
    // {
    //   text: 'Explore',
    //   to: '/',
    // },
    {
      text: 'Join this project',
      isToast: true,
      to: '/',
    },
  ]

  return (
    <div className="items-center gap-6 hidden md:flex">
      {navData.map((item, i) => {
        if (item.isToast) {
          return (
            <div
              key={i}
              className="inline-flex text-neutral-600 cursor-pointer"
              onClick={() => {
                toast.success(
                  'Join PenX Discord and contact 0xZio in "Join this project" channel.',
                )
              }}
            >
              {item.text}
            </div>
          )
        }
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
