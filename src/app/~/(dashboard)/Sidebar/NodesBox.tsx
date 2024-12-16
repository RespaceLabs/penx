'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { store } from '@/store'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { JournalList } from './JournalList'
import { NoteList } from './NoteList'

enum TabTypes {
  Objects = 'Objects',
  Journals = 'Journals',
}
export function NodesBox() {
  const [type, setType] = useState(TabTypes.Objects)
  const { push } = useRouter()
  return (
    <Tabs
      className="w-full"
      value={type}
      onValueChange={(v) => {
        setType(v as TabTypes)
      }}
    >
      <TabsList className="text-sm w-full flex px-1">
        <TabsTrigger value={TabTypes.Objects} className="flex-1 text-xs">
          Objects
        </TabsTrigger>
        <TabsTrigger value={TabTypes.Journals} className="flex-1 text-xs">
          Journals
        </TabsTrigger>
      </TabsList>

      <TabsContent value={TabTypes.Objects}>
        <Button
          size="sm"
          className="w-full rounded text-sm text-foreground/60 justify-start h-8 px-1 gap-2"
          variant="ghost"
          onClick={async () => {
            const node = await store.node.createPageNode()
            push(`/~/objects/${node.id}`)
          }}
        >
          <Plus size={16}></Plus>
          <div className="text-sm">Create</div>
        </Button>
        <NoteList />
      </TabsContent>

      <TabsContent value={TabTypes.Journals}>
        <JournalList />
      </TabsContent>
    </Tabs>
  )
}
