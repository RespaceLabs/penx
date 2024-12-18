'use client'

import { KeyIcon } from 'lucide-react'
import { usePasswordDialog } from '@/components/PasswordDialog/usePasswordDialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LinkPasswordButton() {
  const { setIsOpen } = usePasswordDialog()

  return (
    <div>
      <Button
        size="lg"
        variant="outline"
        className={cn('rounded-lg gap-2 w-full')}
        onClick={async () => {
          setIsOpen(true)
        }}
      >
        <KeyIcon size={16} />
        <div className="">Set password</div>
      </Button>
    </div>
  )
}
