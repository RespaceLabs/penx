import { useAtom } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { syncStatusAtom } from '@penx/store'

export function useSyncStatus() {
  const [status, setStatus] = useAtom(syncStatusAtom)
  return {
    isNormal: status === SyncStatus.NORMAL,
    isPulling: status === SyncStatus.PULLING,
    isPushing: status === SyncStatus.PUSHING,
    isSyncing: status === SyncStatus.PULLING || status === SyncStatus.PUSHING,
    isFailed: [SyncStatus.PULL_FAILED, SyncStatus.PUSH_FAILED].includes(status),
    status,
    setStatus,
  }
}
