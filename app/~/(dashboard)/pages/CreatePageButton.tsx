'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LoadingCircle from '@/components/icons/loading-circle'
import { Button } from '@/components/ui/button'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { api } from '@/lib/trpc'

export function CreatePageButton() {
  const { push } = useRouter()
  const { refetch } = useDatabases()
  const [isLoading, setLoading] = useState(false)
  async function createPage() {
    setLoading(true)
    try {
      const page = await api.page.create.mutate({
        name: '',
      })
      push(`/~/page?id=${page.id}`)
      refetch()
    } catch (error) {
      toast.error('Failed to create page')
    }
    setLoading(false)
  }
  return (
    <Button
      className="w-24 flex gap-1"
      disabled={isLoading}
      onClick={createPage}
    >
      <span>New Page</span>
      {isLoading && <LoadingCircle></LoadingCircle>}
    </Button>
  )
}
