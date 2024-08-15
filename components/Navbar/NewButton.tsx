'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCreationDialog } from '../CreationDialog/useCreationDialog'

interface Props {}

export function NewButton({}: Props) {
  const { setIsOpen } = useCreationDialog()

  return (
    <Button size="sm" className="rounded-xl" onClick={() => setIsOpen(true)}>
      <Plus size={20}></Plus>
      <div>Create</div>
    </Button>
  )
}
