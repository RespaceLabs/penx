import { db } from '@penx/local-db'
import { INode, NodeType } from '@penx/model-types'
import { NodeCleaner } from '@penx/node-normalizer'
import { sleep } from '@penx/shared'

const INTERVAL = 5 * 1000

export async function clearNodes() {
  while (true) {
    // console.log('clear nodes...')
    await new NodeCleaner().cleanDeletedNodes()
    await sleep(INTERVAL)
  }
}
