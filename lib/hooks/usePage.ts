'use client'

import { atom, useAtom } from 'jotai'
import { store } from '@/lib/store'
import { api, trpc } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { PostTag, Tag } from '@/server/db/schema'

export type PageData = RouterOutputs['page']['byId']

export const pageAtom = atom<PageData>(null as any as PageData)

export const pageLoadingAtom = atom<boolean>(false)

export function usePageLoading() {
  const [isPageLoading, setPageLoading] = useAtom(pageLoadingAtom)
  return { isPageLoading, setPageLoading }
}

export function usePage() {
  const [page, setPage] = useAtom(pageAtom)
  return { page, setPage }
}

export async function loadPage(pageId: string) {
  store.set(pageLoadingAtom, true)
  const page = await api.page.byId.query(pageId)
  store.set(pageAtom, page)
  store.set(pageLoadingAtom, false)
}

export function updatePage(data: Partial<PageData>) {
  const page = store.get(pageAtom)
  store.set(pageAtom, {
    ...page,
    ...data,
  })
}
