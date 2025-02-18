import { ReactNode } from 'react'
import { SettingNav } from './SettingNav'


// export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 md:max-w-4xl md:mx-auto pt-16 px-4">
      <div className="flex-col md:flex-row flex md:items-center md:justify-between gap-2 border-b border-foreground/10 pb-4">
        <div className="text-3xl font-bold">Settings</div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <SettingNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
