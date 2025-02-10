import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col justify-between">
        <div className="text-3xl font-bold">Manage tags</div>
      </div>
      {children}
    </div>
  )
}
