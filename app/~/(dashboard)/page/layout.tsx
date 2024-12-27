import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="w-full pt-12 md:pt-0 h-screen">{children}</div>
}
