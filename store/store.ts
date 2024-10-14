'use client'

import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  get: baseStore.get,
  set: baseStore.set,
})
