'use client'

import { useSpaces } from '@/hooks/useSpaces'
import { DeleteSpaceForm } from './DeleteSpaceForm'
import { UpdateSpaceForm } from './UpdateSpaceForm'

export default function SiteSettingsIndex() {
  const { space } = useSpaces()
  return (
    <div className="flex flex-col space-y-6">
      <UpdateSpaceForm />
      <DeleteSpaceForm spaceName={space?.name!} />
    </div>
  )
}
