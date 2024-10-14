import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function SocialNav({ className }: Props) {
  return (
    <div
      className={cn(
        'flex gap-2 justify-center items-center mx-auto text-neutral-400 cursor-pointer',
        className,
      )}
    >
      <a
        href="https://discord.com/invite/nyVpH9njDu"
        target="_blank"
        className="inline-flex"
      >
        <span className="i-[ic--round-discord] w-7 h-7  hover:text-neutral-600"></span>
      </a>
      <a
        href="https://github.com/0xzio/penx"
        target="_blank"
        className="inline-flex"
      >
        <span className="i-[mdi--github] w-7 h-7  hover:text-neutral-600"></span>
      </a>
      <a href="https://x.com/0xzio_eth" target="_blank" className="inline-flex">
        <span className="i-[prime--twitter] w-5 h-5 hover:text-neutral-600"></span>
      </a>
    </div>
  )
}
