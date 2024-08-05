'use client'

import { trpc } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { useParams } from 'next/navigation'

export type Space = RouterOutputs['space']['byId']

export function useSpace() {
  const params = useParams() as Record<string, string>
  const { data: space, ...rest } = trpc.space.byId.useQuery(params.id)
  return { space: space!, ...rest }
}
