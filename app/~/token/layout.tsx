'use client'

import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-accent h-screen">
      {children}
    </div>
  )
}
