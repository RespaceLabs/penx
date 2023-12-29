import { TableType } from '@penx/indexeddb'

export const tableSchema: TableType[] = [
  {
    name: 'space',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      name: {
        unique: false,
      },
    },
    timestamps: false,
  },
  {
    name: 'node',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      spaceId: {
        unique: false,
      },
      type: {
        unique: false,
      },
    },
    timestamps: false,
  },

  {
    name: 'file',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      spaceId: {
        unique: false,
      },
    },
    timestamps: false,
  },

  {
    name: 'extension',
    primaryKey: {
      name: 'id',
      autoIncrement: false,
      unique: true,
    },
    indexes: {
      spaceId: {
        unique: false,
      },
    },
    timestamps: false,
  },
]
