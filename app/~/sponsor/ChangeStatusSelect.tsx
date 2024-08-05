import LoadingDots from '@/components/icons/loading-dots'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSpaces } from '@/hooks/useSpaces'
import { trpc } from '@/lib/trpc'
import { Sponsor } from '@prisma/client'

interface Props {
  sponsor: Sponsor
  // status: 'PENDING' | 'AGREED' | 'REJECTED'
}

export function ChangeStatusSelect({ sponsor }: Props) {
  const { refetch, isFetching } = trpc.sponsor.listBySpaceId.useQuery(
    sponsor.spaceId,
  )
  const { mutateAsync, isPending } = trpc.sponsor.updateStatus.useMutation()

  if (isPending || isFetching) {
    return (
      <div className="w-[120px] h-10">
        <LoadingDots color="white"></LoadingDots>
      </div>
    )
  }

  return (
    <Select
      defaultValue={sponsor.status}
      onValueChange={async (value) => {
        await mutateAsync({
          id: sponsor.id,
          spaceId: sponsor.spaceId,
          status: value,
        })
        await refetch()
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="AGREED">Agreed</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
