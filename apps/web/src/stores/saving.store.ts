import { getState, mutate, useStore } from 'stook'

const key = 'Saving'

export function useSaving() {
  const [saving, setSaving] = useStore<boolean | null>(key, null)

  return { saving, setSaving }
}

export function mutateSaving(saving: boolean) {
  return mutate(key, saving)
}

export function getSaving(): boolean {
  return getState(key)
}
