'use client'

import { AddThemeDialog } from './AddThemeDialog/AddThemeDialog'
import { PublishThemeDialog } from './PublishThemeDialog/PublishThemeDialog'
import { ThemeList } from './ThemeList'

export default function Page() {
  return (
    <div>
      <AddThemeDialog />
      <PublishThemeDialog />
      <ThemeList />
    </div>
  )
}
