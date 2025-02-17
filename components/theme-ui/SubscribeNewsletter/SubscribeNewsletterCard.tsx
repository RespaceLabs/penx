'use client'

import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { SubscribeNewsletterDialog } from './SubscribeNewsletterDialog'
import { useSubscribeNewsletterDialog } from './useSubscribeNewsletterDialog'

interface Props {
  className?: string
  site: Site
}

export function SubscribeNewsletterCard({ site, className }: Props) {
  const { setIsOpen } = useSubscribeNewsletterDialog()
  if (process.env.NEXT_PUBLIC_CAN_SUBSCRIBE !== 'yes') return null

  return (
    <>
      <SubscribeNewsletterDialog site={site} />
      <div
        className={cn(
          'mx-auto flex flex-col items-center gap-4 mt-8',
          className,
        )}
      >
        <div className="font-bold text-2xl">Subscribe to {site.name}</div>
        <Button
          className="w-40 flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Mail size={16} className="opacity-70" />
          <span>Subscribe</span>
        </Button>
      </div>
    </>
  )
}
