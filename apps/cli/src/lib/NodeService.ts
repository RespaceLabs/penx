import { v4 as uuidv4 } from 'uuid'
import jetpack from 'fs-jetpack'
import { createNodeFromText } from './createNodeFromText'
import { INode } from '../types/INode'
import { dbPath } from '../constants'

interface Item {
  id: string
  nodeData: string
  added: boolean
}

class NodeService {
  addText(text: string) {
    const node = createNodeFromText(text)
    const data = readDB()
    data.push({
      id: uuidv4(),
      nodeData: JSON.stringify(node),
      added: false,
    })
    writeDB(data)
  }

  addNodes(nodes: INode[]) {
    const data = readDB()
    for (const node of nodes) {
      data.push({
        id: uuidv4(),
        nodeData: JSON.stringify(node),
        added: false,
      })
    }
    writeDB(data)
  }

  clearDB() {
    writeDB([])
  }

  readItems(): Item[] {
    return readDB()
  }
}

export const nodeService = new NodeService()

function writeDB(data: Item[]) {
  jetpack.write(dbPath, data)
}

function readDB(): Item[] {
  if (!jetpack.exists(dbPath)) return [] as Item[]
  return jetpack.read(dbPath, 'json') || []
}
