'use client'

import { Financial } from '@/components/token/financial'
import { TradingPanel } from '@/components/token/TradingPanel'

export default function TokenPage() {
  return (
    <div className="flex justify-center items-center">
      {/* <div className='h-full gap-2 w-2/3 ml-6 bg-gray-200'>
          <Financial />
        </div> */}

      <TradingPanel />
    </div>
  )
}
