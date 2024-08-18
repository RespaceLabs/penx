'use client'

import { Transaction } from '@/components/spaceToken/Transaction'
import { useSpace } from '@/hooks/useSpace'

export default function SymbolPage() {
  const { space } = useSpace()

  return (
    <div className="flex justify-center items-center h-[100%]">
      <div className="w-1/3 min-w-[500px] max-w-[610px] grid gap-4 h-fit bg-white p-6 rounded-xl">
        {space ? (
          <Transaction space={space} />
        ) : (
          <div>Please create or join a space.</div>
        )}
      </div>
    </div>
  )
}
