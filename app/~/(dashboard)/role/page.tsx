'use client'

import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import RoleSection from './RoleSection'

export const dynamic = 'force-static'

export default function Page() {
  const {
    isLoading: isAdminListLoading,
    data: adminList,
    refetch: refetchAdminList,
  } = trpc.user.listAdminUsers.useQuery()

  const {
    isLoading: isAuthorListLoading,
    data: authorList,
    refetch: refetchAuthorList,
  } = trpc.user.listAuthorUsers.useQuery()

  const { mutateAsync: adminSetmutateAsync } =
    trpc.user.setRoleToAdmin.useMutation()
  const { mutateAsync: authorSetmutateAsync } =
    trpc.user.setRoleToAuthor.useMutation()
  const { mutateAsync: readerSetmutateAsync } =
    trpc.user.setRoleToReader.useMutation()

  const inviteUserToRole = async (
    mutateAsync: any,
    address: string,
    role: string,
  ) => {
    try {
      await mutateAsync({ address })
      refetchAdminList()
      refetchAuthorList()
      toast.success(`User invited to ${role} role`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div className="flex flex-col justify-between space-y-8">
      <RoleSection
        title="Admin role"
        users={adminList}
        isLoading={isAdminListLoading}
        onInvite={(address) =>
          inviteUserToRole(adminSetmutateAsync, address, 'admin')
        }
        onRemove={(address) =>
          inviteUserToRole(readerSetmutateAsync, address, 'reader')
        }
      />

      <RoleSection
        title="Author role"
        users={authorList}
        isLoading={isAuthorListLoading}
        onInvite={(address) =>
          inviteUserToRole(authorSetmutateAsync, address, 'author')
        }
        onRemove={(address) =>
          inviteUserToRole(readerSetmutateAsync, address, 'reader')
        }
      />
    </div>
  )
}
