'use client'

import { PlateEditor } from '@/components/editor/plate-editor'
import { useSpaceContext } from '@/components/SpaceContext'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  const space = useSpaceContext()

  return <PlateEditor value={space.aboutJson} readonly />
}
