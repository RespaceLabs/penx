import { PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <div>Layout</div>
      <div>{children}</div>
    </div>
  )
}
