import Link from 'next/link'
import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  const links = [
    ...site?.navLinks,
    {
      pathname: '/creator-fi/plans',
      title: 'CreatorFi',
      visible: true,
    },
  ]
  return (
    <header
      className={cn('flex items-center w-full justify-between py-4 h-16 z-40')}
    >
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6">
          {links.map((link) => {
            if (link.pathname === '/creator-fi/plans' && !site.spaceId) {
              return null
            }

            if (!link.visible) return null
            return (
              <Link
                key={link.pathname}
                href={link.pathname}
                className={cn(
                  'font-medium hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90',
                )}
              >
                {link.title}
              </Link>
            )
          })}

          {site.spaceId && (
            <Link
              href="/membership"
              className={cn(
                'font-medium hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90',
                'border border-brand-500 text-brand-500 rounded-full px-2 py-1 hover:bg-brand-500 hover:text-background text-sm',
              )}
            >
              Membership
            </Link>
          )}
        </div>
      </div>

      <div className="flex item-center gap-2">
        <div className="flex items-center">
          <Airdrop />
        </div>
        <Profile />
      </div>
    </header>
  )
}
