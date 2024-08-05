'use client'

import { useCreation, useQueryCreation } from '@/hooks/useCreation'
import { PostWithSpace } from '@/hooks/usePost'
import { RouterOutputs } from '@/server/_app'
import { BuyDialog } from './BuyDialog/BuyDialog'
import { SellDialog } from './SellDialog/SellDialog'

interface Props {
  creationId: string
  space: RouterOutputs['space']['byId']
  post?: PostWithSpace
}

export function InitBuySellDialog({ post, space, creationId }: Props) {
  const { creation } = useCreation()
  const { isLoading, data } = useQueryCreation(creationId)
  if (isLoading) return null
  if (!creation) return null
  return (
    <>
      <BuyDialog space={space} post={post} />
      <SellDialog space={space} post={post} />
    </>
  )
}
