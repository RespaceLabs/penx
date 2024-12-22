'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LoadingCircle from '@/components/icons/loading-circle'
import { Button } from '@/components/ui/button'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { api } from '@/lib/trpc'

export function CreateDatabaseButton() {
  const { push } = useRouter()
  const { refetch } = useDatabases()
  const [isLoading, setLoading] = useState(false)
  async function createDatabase() {
    setLoading(true)
    try {
      const database = await api.database.create.mutate({
        name: '',
      })
      push(`/~/database?id=${database.id}`)
      refetch()
    } catch (error) {
      toast.error('Failed to create database')
    }
    setLoading(false)
  }
  return (
    <Button
      className="w-24 flex gap-1"
      disabled={isLoading}
      onClick={createDatabase}
    >
      <span>Create</span>
      {isLoading && <LoadingCircle></LoadingCircle>}
    </Button>
  )
}
