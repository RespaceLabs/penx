import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { cn } from '@/lib/utils'
import { Site } from '@penxio/types'
import { Lobster } from 'next/font/google'
import Link from 'next/link'
import { PostTypeNav } from './PostTypeNav'

const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

const headerNavLinks = [
  { href: '/', title: 'Home' },
  // { href: '/posts', title: 'Blog' },
  // { href: '/tags', title: 'Tags' },
  { href: '/about', title: 'About' },
  { href: '/creator-fi', title: 'CreatorFi' },
  { href: '/membership', title: 'Membership', isMembership: true },
]

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header className="">
      <div className="flex items-start w-full justify-between py-4 z-40 bg-background/40 backdrop-blur-sm">
        <div className="lg:flex items-center space-x-4 leading-5 sm:space-x-6 hidden w-60">
          <div className="flex items-center space-x-4">
            {headerNavLinks.map((link) => {
              if (link.href === '/creator-fi' && !site.spaceId) {
                return null
              }

              if (link.href === '/membership' && !site.spaceId) {
                return null
              }
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cn(
                    'font-medium flex items-center hover:text-brand-500 text-foreground/60 text-xs hover:scale-105 transition-all',
                    link.isMembership &&
                      'border border-brand-500 text-brand-500 rounded-full px-2 py-1 text-xs',
                  )}
                >
                  {link.title}
                </Link>
              )
            })}
          </div>
          {/* {MobileNav && <MobileNav />} */}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:items-center lg:justify-between gap-4 lg:mx-auto sm:max-w-xl">
            <Link
              href="/"
              className="flex items-center md:justify-center gap-2"
            >
              {site.logo && (
                <img src={site.logo} alt="" className="w-8 h-8 rounded-full" />
              )}
              <div
                className={cn(
                  'font-normal text-2xl flex-shrink-0',
                  lobster.className,
                )}
              >
                {site.name}
              </div>
            </Link>
            <PostTypeNav className="hidden md:flex" />
          </div>
        </div>
        <div className="flex item-center justify-end gap-3 w-60">
          <Link
            href="/about"
            className="font-medium flex items-center hover:text-brand-500 text-foreground/60 text-xs hover:scale-105 transition-all sm:hidden"
          >
            About
          </Link>

          <div className="flex items-center">
            <Airdrop />
          </div>
          <Profile />
        </div>
      </div>
      <PostTypeNav className="flex md:hidden" />
    </header>
  )
}
