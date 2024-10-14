import { ReactNode } from 'react'
import { NewButton } from '@/components/Navbar/NewButton'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">Settings</div>
      </div>
      {children}
    </div>
  )
}
