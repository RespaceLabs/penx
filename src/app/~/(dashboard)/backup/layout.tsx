import { ReactNode } from 'react'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="text-3xl font-bold">Backup</div>
        <div className="text-foreground/60 text-sm">
          Use Google Drive to backup your data.
        </div>
      </div>

      {children}
    </div>
  )
}
