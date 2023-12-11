import { IS_DB_OPENED } from '@penx/constants'

export function protectDB() {
  Object.defineProperty(window, IS_DB_OPENED, {
    value: false,
    writable: true,
    configurable: true,
    enumerable: true,
  })
  const originalOpen = indexedDB.open
  indexedDB.open = function (name, version) {
    // TODO:
    if ((window as any).__IS_DB_OPENED__) {
      throw new Error(`IndexedDB is already opened ${name}`)
      // return {} as any // TODO:
    }

    const result = originalOpen.call(indexedDB, name, version)

    window[IS_DB_OPENED] = true

    Object.defineProperty(window, IS_DB_OPENED, {
      value: true,
      writable: false,
      configurable: false,
      enumerable: true,
    })
    return result
  }
}
