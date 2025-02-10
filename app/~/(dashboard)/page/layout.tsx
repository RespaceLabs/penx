import { ReactNode } from 'react'
import { PageNav } from '@/components/Page/PageNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-12">
      <PageNav />
      <div className="mx-auto md:max-w-[750px] w-full">{children}</div>
    </div>
  )
}
