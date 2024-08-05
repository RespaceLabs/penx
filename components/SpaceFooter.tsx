import { Button } from '@/components/ui/button'

interface Props {}

export function SpaceFooter({}: Props) {
  return (
    <div className="text-center pb-12 space-y-2">
      <div className="flex gap-2 justify-center items-center mx-auto text-neutral-400 cursor-pointer">
        <a href="https://discord.com/invite/nyVpH9njDu" target="_blank">
          <span className="i-[ic--round-discord] w-7 h-7  hover:text-neutral-600"></span>
        </a>
        <a href="https://github.com/0xzio/penx" target="_blank">
          <span className="i-[mdi--github] w-7 h-7  hover:text-neutral-600"></span>
        </a>
        <a href="https://x.com/0xzio_eth" target="_blank">
          <span className="i-[prime--twitter] w-5 h-5 hover:text-neutral-600"></span>
        </a>
      </div>
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="rounded-xl px-10 cursor-pointer"
      >
        <a href="https://www.penx.io" className="cursor-pointer">
          Write your own
        </a>
      </Button>
      <div className="text-neutral-500">
        PenX: The value network for writers
      </div>
    </div>
  )
}
