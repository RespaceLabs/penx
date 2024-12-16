import { ReactNode } from 'react'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
