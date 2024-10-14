'use client'

import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { Transaction } from '../../Space/Transaction'

export default function Page() {
  const { space } = useSpace()
  if (!space) return
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="w-full space-y-8 md:w-[480px]">
        <div className="text-center text-4xl font-bold">Trade ${space.symbolName} token</div>
        <Transaction />
      </div>
    </div>
  )
}
