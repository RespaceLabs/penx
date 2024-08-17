'use client'

import { useMemberDialog } from '@/components/MemberDialog/useMemberDialog'
import { Button } from '@/components/ui/button'

interface Props {}

export function MemberButton({}: Props) {
  const { setIsOpen } = useMemberDialog()

  return (
    <Button
      className="flex items-center gap-2 rounded-2xl"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      <span className="i-[formkit--ethereum] w-5 h-5"></span>
      <div>Become a member</div>
    </Button>
  )
}
