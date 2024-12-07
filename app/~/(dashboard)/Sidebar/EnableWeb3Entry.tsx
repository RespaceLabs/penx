'use client'

import { ArrowRight, Bitcoin } from 'lucide-react'

export function EnableWeb3Entry() {
  return (
    <div className="mt-2 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-between cursor-pointer transition-all">
      <div className="space-y-1 text-foreground/80 flex-1">
        <div className="flex items-center gap-2">
          <div className="font-bold text-base">Enable Web3</div>
        </div>
        <ul className="text-xs text-foreground/60 leading-normal list-disc list-inside">
          <li>Tokenize your blog</li>
          <li>Enable blog membership</li>
          <li>Make post collectible</li>
        </ul>
      </div>
      <ArrowRight size={20} className="text-foreground/50 flex-shrink-0" />
    </div>
  )
}
