import { IconGoogle } from '@/components/icons/IconGoogle'
import { Node } from '@/lib/model'
import Link from 'next/link'

interface Props {
  node: Node
}

export function GoogleBackupButton() {
  return (
    <Link
      href="/~/backup"
      className="flex-1 flex items-center justify-center gap-1 cursor-pointer hover:bg-foreground/5 transition-all"
    >
      <IconGoogle className="w-3 h-3" />
      <div>Backup</div>
    </Link>
  )
}
