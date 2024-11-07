'use client'

import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { PlateEditor } from '@/components/editor/plate-editor'

export const dynamic = 'force-static'

export default function Page() {
  const { space } = useSpace()

  return <PlateEditor value={space.aboutJson} readonly />
}
