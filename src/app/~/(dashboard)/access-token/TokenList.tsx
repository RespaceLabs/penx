'use client'

import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import LoadingDots from '@/components/icons/loading-dots'
import { Separator } from '@/components/ui/separator'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { AccessToken } from '@prisma/client'
import { format } from 'date-fns'
import { KeySquare } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  isLoading: boolean
  tokenList: AccessToken[] | undefined
  refetch: any
}

export default function AccessTokenList({
  isLoading,
  tokenList,
  refetch,
}: Props) {
  const { mutateAsync } = trpc.accessToken.delete.useMutation()

  if (isLoading) {
    return <LoadingDots />
  }

  async function handleDelete(id: string) {
    try {
      await mutateAsync({ id })
      toast.success('Access token deleted successfully')
      refetch()
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div>
      {tokenList && tokenList.length > 0 ? (
        tokenList?.map((token) => (
          <div
            key={token.id}
            className="flex border-b px-2 py-3 font-mono hover:bg-stone-100"
          >
            <div className="grow flex flex-col space-y-2">
              <div className="flex space-x-2">
                <KeySquare className="h-6 w-6" />
                <a className="border py-1 px-2 rounded-lg text-xs font-medium border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {token.alias}
                </a>
              </div>

              <div className="flex text-xs text-muted-foreground space-x-4">
                <a>
                  createAt: {format(new Date(token.createdAt), 'yyyy-MM-dd')}
                </a>
                <Separator orientation="vertical" />
                <a>
                  expiredAt:{' '}
                  {token.expiredAt
                    ? format(new Date(token.expiredAt), 'yyyy-MM-dd')
                    : 'Never exp'}
                </a>
                <Separator orientation="vertical" />
                <a>
                  lastUsedAt:{' '}
                  {token.lastUsedAt
                    ? format(new Date(token.lastUsedAt), 'yyyy-MM-dd')
                    : 'Never used'}
                </a>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <DeleteConfirmDialog
                title="Delete Confirm"
                content="Are you sure you want to delete this access token?"
                tooltipContent="delete access token"
                onConfirm={() => handleDelete(token.id)}
              />
            </div>
          </div>
        ))
      ) : (
        <div>No access tokens found.</div>
      )}
    </div>
  )
}
