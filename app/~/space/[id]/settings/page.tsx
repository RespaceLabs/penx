'use client'

import { useSpace } from '@/hooks/useSpace'
import { DeleteSpaceForm } from './DeleteSpaceForm'
import { UpdateSpaceForm } from './UpdateSpaceForm'

export default function SiteSettingsIndex() {
  const { space } = useSpace()
  return (
    <div className="flex flex-col space-y-6">
      <UpdateSpaceForm />
      <DeleteSpaceForm spaceName={space?.name!} />
    </div>
  )
}
