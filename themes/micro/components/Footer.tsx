import { ReactNode } from 'react'
import { Site } from '@penxio/types'
import SocialIcon from './social-icons'

interface Props {
  ModeToggle: () => ReactNode
  site: Site
}

export function Footer({ site, ModeToggle }: Props) {
  if (!site) return null
  const socials = site.socials
  return (
    <footer className="mt-auto mb-8">
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${socials?.email}`} size={6} />
          <SocialIcon kind="github" href={socials.github} size={6} />
          <SocialIcon kind="facebook" href={socials.facebook} size={6} />
          <SocialIcon kind="youtube" href={socials.youtube} size={6} />
          <SocialIcon kind="linkedin" href={socials.linkedin} size={6} />
          <SocialIcon kind="twitter" href={socials.twitter} size={6} />
          <SocialIcon kind="x" href={socials.x} size={6} />
          <SocialIcon kind="instagram" href={socials.instagram} size={6} />
          <SocialIcon kind="threads" href={socials.threads} size={6} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm item-center text-card-foreground/50">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">{site.name}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center gap-1">
            Build with
            <a
              href="https://penx.io"
              target="_blank"
              className="text-brand-500"
            >
              PenX
            </a>
          </div>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
