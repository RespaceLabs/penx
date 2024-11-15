'use client'

import * as React from 'react'
import { Rocket } from 'lucide-react'

export function AirdropButton() {
  return (
    <div className="flex items-center gap-1 text-xs rounded-full px-2 py-1 text-foreground/50 font-medium cursor-pointer hover:text-foreground/80 h-8 transition-colors">
      <Rocket size={12} />
      <div>Airdrop</div>
    </div>
  )
}
