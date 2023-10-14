import _ from 'lodash'
import { ArraySorter } from '@penx/indexeddb'
import { IDoc } from '@penx/local-db'
import { Doc } from '../entity'

type FindOptions<T = IDoc> = {
  where?: Partial<T>
  limit?: number
  orderByDESC?: boolean
  sortBy?: keyof T
}

export class DocListService {
  docs: Doc[] = []

  constructor(private raw: IDoc[] = []) {
    this.docs = this.raw.map((raw) => new Doc(raw))
  }

  get normalDocs() {
    return this.docs.filter((doc) => doc.isNormal)
  }

  get trashedDocs() {
    return this.docs.filter((doc) => doc.isTrashed)
  }

  // TODO: need to improvement
  find(options: FindOptions = {}): Doc[] {
    const data = this.raw
    let result: IDoc[] = []

    // handle where
    if (Reflect.has(options, 'where') && options.where) {
      const whereKeys = Object.keys(options.where)

      result = data.filter((item) => {
        const dataKeys = Object.keys(item)

        const every = whereKeys.every((key) => {
          return (
            dataKeys.includes(key) &&
            (item as any)[key] === (options.where as any)[key]
          )
        })

        return every
      })

      // handle sortBy
      if (Reflect.has(options, 'sortBy') && options.sortBy) {
        // sort data
        result = new ArraySorter<IDoc>(result).sortBy({
          desc: Reflect.has(options, 'orderByDESC') && options.orderByDESC,
          keys: [options.sortBy as string],
        })
      }

      if (Reflect.has(options, 'limit') && options.limit) {
        // slice data
        result = result.slice(0, +options.limit)
      }
    }

    return result.map((raw) => new Doc(raw))
  }
}
