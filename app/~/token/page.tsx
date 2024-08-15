'use client'

import { Transaction } from "@/components/token/Transaction"

export default function SymbolPage() {
  return (
    <div className="flex justify-center items-center h-[100%]">
      <div className="w-1/3 min-w-[500px] max-w-[610px] grid gap-4 h-fit bg-white p-6 rounded-xl">
        <Transaction />
      </div>
    </div>
  )
}
