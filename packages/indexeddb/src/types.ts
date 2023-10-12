export type ConfigType<T = TableType> = {
  version: number
  name: string
  tables: T[]
  indexedDB?: IDBFactory
}

export type TimeStampsType = {
  createdAt: number
  updatedAt: number
}

export type TableType = {
  name: string
  primaryKey: {
    name: string
    autoIncrement: boolean
    unique: boolean
  }
  indexes: {
    [key: string]: {
      unique?: boolean
      multiEntry?: boolean
    }
  }
  initData?: {
    [key: string]: IDBValidKey | IDBKeyRange
  }[]
  timestamps?: boolean
}

export type OptionsWhereAsCallback<I> = (list: I[]) => Partial<I>[]

export type OptionsWhereAsObject<T extends keyof any = any> = {
  [key in T]: IDBValidKey | IDBKeyRange
}

export type OptionsType<I, T extends keyof any = any> = {
  where?: OptionsWhereAsObject<T> | OptionsWhereAsCallback<I>
  limit?: number
  orderByDESC?: boolean
  sortBy?: keyof I | keyof I[]
}
