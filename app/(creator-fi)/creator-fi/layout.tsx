'use client'

import { ReactNode, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

enum TabTypes {
  Holders = 'Holders',
  Trades = 'Trades',
}

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  const [type, setType] = useState(TabTypes.Trades)

  return (
    <div>
      <div className="mx-auto mt-4 flex w-full flex-col gap-12 p-3 sm:w-full">
        <div className="mx-auto w-full xl:max-w-5xl">{children}</div>

        {/* <div className="flex w-full flex-shrink-0 flex-col lg:w-[360px]">
          <div className="mt-8 lg:block">
            <Tabs
              className="w-full"
              value={type}
              onValueChange={(v) => {
                setType(v as TabTypes)
              }}
            >
              <TabsList className="pb-2">
                <TabsTrigger value={TabTypes.Trades}>Trades</TabsTrigger>
                <TabsTrigger value={TabTypes.Holders}>Holders</TabsTrigger>
              </TabsList>

              {type === TabTypes.Trades && (
                <TabsContent value={TabTypes.Trades}>
                  <TradeList />
                </TabsContent>
              )}
              {type === TabTypes.Holders && (
                <TabsContent value={TabTypes.Holders}>
                  <HolderList />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div> */}
      </div>
    </div>
  )
}
