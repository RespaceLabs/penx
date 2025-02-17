import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import Link from './Link'

interface Props {
  site: Site
}

export const Nav = ({ site }: Props) => {
  return (
    <div className="flex justify-center items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 border-t border-b h-12 border-foreground/5">
      {site.navLinks.map((link) => {
        if (!link.visible) return null
        return (
          <Link
            key={link.title}
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
            'font-medium hover:text-brand-500 text-foreground/90',
            'border border-brand-500 text-brand-500 rounded-full px-2 py-1 hover:bg-brand-500 hover:text-background text-sm',
          )}
        >
          Membership
        </Link>
      )}
    </div>
  )
}
