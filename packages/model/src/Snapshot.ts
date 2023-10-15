import CryptoJS from 'crypto-js'
import { IDoc, ISpace } from '@penx/types'

export class Snapshot {
  timestamp: number

  // Record<docId, md5>
  map: Record<string, string> = {}

  constructor(space: ISpace) {
    this.timestamp = space.snapshot?.timestamp || Date.now()
    this.map = space.snapshot?.hashMap || {}
  }

  md5Doc = (doc: IDoc) => {
    const data = {
      title: doc.title,
      content: doc.content,
    }
    return CryptoJS.MD5(JSON.stringify(data)).toString()
  }

  private updateTimestamp = () => {
    this.timestamp = Date.now()
  }

  add = (docId: string, doc: IDoc) => {
    this.updateTimestamp()
    this.map[docId] = this.md5Doc(doc)
  }

  update = (docId: string, doc: IDoc) => {
    this.updateTimestamp()
    this.map[docId] = this.md5Doc(doc)
  }

  delete = (docId: string) => {
    this.updateTimestamp()
    delete this.map[docId]
  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      hashMap: this.map,
    }
  }
}
