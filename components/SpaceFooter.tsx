import { Button } from '@/components/ui/button'
import { SocialNav } from './SocialNav'

interface Props {}

export function SpaceFooter({}: Props) {
  return (
    <div className="text-center pb-12 space-y-2">
      <SocialNav></SocialNav>
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
