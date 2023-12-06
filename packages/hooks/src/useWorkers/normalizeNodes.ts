import ky from 'ky'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { sleep } from '@penx/shared'

// const INTERVAL = 5 * 60 * 1000
const INTERVAL = 5 * 1000

let isPolling = true

export async function normalizeNodes() {
  // while (isPolling) {
  //   await normalize()
  //   await sleep(INTERVAL)
  // }
}

async function normalize() {
  // console.log('normalize.........nodes')
}
