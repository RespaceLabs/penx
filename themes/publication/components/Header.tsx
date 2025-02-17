import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Merienda } from 'next/font/google'
import Link from './Link'
import { Nav } from './Nav'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const headerNavLinksRight = [{ href: '/creator-fi', title: 'CreatorFi' }]

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header className="z-40">
      <div
        className={cn(
          'flex justify-center items-center w-full py-4 h-16 px-0 sm:px-4',
        )}
      >
        <div className="flex-1 hidden md:block"></div>
        <div className="flex-1 flex items-center justify-start md:justify-center">
          <Link href="/" aria-label={site.name}>
            <div className="flex items-center justify-between">
              <div
                className={cn('h-6 text-2xl font-semibold', merienda.className)}
              >
                {site.name}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-end flex-1 gap-4">
          <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6">
            {headerNavLinksRight.map((link) => {
              if (link.href === '/creator-fi' && !site.spaceId) {
                return null
              }
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="font-medium hover:text-brand-500  text-foreground/90"
                >
                  {link.title}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center">
            <Airdrop />
          </div>
          <Profile></Profile>
        </div>
      </div>
      <Nav site={site} />
    </header>
  )
}
