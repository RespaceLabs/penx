'use client'

interface Props {
  subdomain: string
}

export function SpaceHomeLink({ subdomain }: Props) {
  const url = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@${subdomain}`
  return (
    <a
      href={`/@${subdomain}`}
      target="_blank"
      rel="noreferrer"
      className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium transition-colors hover:bg-stone-200 hidden md:block text-neutral-600"
    >
      {url} ↗
    </a>
  )
}
