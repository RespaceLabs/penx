'use client'

import { ArrowRight } from 'lucide-react'

export function EnableWeb3Entry() {
  return (
    <div className="mt-2 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-between cursor-pointer transition-all">
      <div className="space-y-1 text-foreground/80">
        <div className="font-bold text-base">Enable Web3</div>
        <div className="text-xs text-foreground/60 leading-normal">
          <div>Tokenize your blog</div>
          <div>Enable blog membership</div>
          <div>Make post collectible</div>
        </div>
      </div>
      <ArrowRight className="text-foreground/50" />
    </div>
  )
}
