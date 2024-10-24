import { ReactNode } from 'react'

interface Props {
  children: (content: string) => ReactNode
}

export function PaidContent({ children }: Props) {
  //
  return (
    <div>
      paid
      {children('content')}
    </div>
  )
}
