'use client'

import { TagPlugin } from './tag-plugin/react'

export const tagPlugin = TagPlugin.configure({
  options: { triggerPreviousCharPattern: /^$|^[\s"']$/ },
})
