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
  Notes = 'Notes',
  Journals = 'Journals',
}
export function NodesBox() {
  const [type, setType] = useState(TabTypes.Notes)
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
        <TabsTrigger value={TabTypes.Notes} className="flex-1 text-xs">
          Notes
        </TabsTrigger>
        <TabsTrigger value={TabTypes.Journals} className="flex-1 text-xs">
          Journals
        </TabsTrigger>
      </TabsList>

      <TabsContent value={TabTypes.Notes}>
        <Button
          size="sm"
          className="w-full rounded text-sm text-foreground/60 justify-start h-8 px-1 gap-2"
          variant="ghost"
          onClick={async () => {
            const node = await store.node.createPageNode()
            push(`/~/notes/${node.id}`)
          }}
        >
          <Plus size={16}></Plus>
          <div>Add note</div>
        </Button>
        <NoteList />
      </TabsContent>

      <TabsContent value={TabTypes.Journals}>
        <JournalList />
      </TabsContent>
    </Tabs>
  )
}
