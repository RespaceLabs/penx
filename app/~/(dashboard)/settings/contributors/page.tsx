'use client'

import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import AddContributor from './AddContributor'
import ContributorList from './ContributorList'

export const dynamic = 'force-static'

export default function Page() {
  const {
    isLoading: isAdminListLoading,
    data: adminList,
    refetch: refetchAdminList,
  } = trpc.user.contributors.useQuery()

  const { mutateAsync: adminSetMutateAsync } =
    trpc.user.setRoleToAdmin.useMutation()
  const { mutateAsync: readerSetMutateAsync } =
    trpc.user.setRoleToReader.useMutation()

  const inviteUserToRole = async (
    mutateAsync: any,
    address: string,
    role: string,
  ) => {
    try {
      await mutateAsync({ address })
      refetchAdminList()
      toast.success(`User invited to ${role} role`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div className="flex flex-col justify-between space-y-8">
      <AddContributor />
      <ContributorList />
    </div>
  )
}
