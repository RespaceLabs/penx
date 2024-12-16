import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return <div className="overflow-x-hidden">{children}</div>
}
