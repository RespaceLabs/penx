import { FILE_DATABASE_NAME, TODO_DATABASE_NAME } from '@/lib/constants'
import { NodeType } from '@/lib/model'
import { formatToDate } from '../libs/formatToDate'
import { getCommonNode } from '../libs/getCommonNode'
import { getNewNode } from '../libs/getNewNode'
import { penxDB, PenxDB } from '../penx-db'
import { databaseDomain, DatabaseDomain } from './database.domain'
import { nodeDomain, NodeDomain } from './node.domain'

export class InitDomain {
  constructor(
    private penx: PenxDB,
    private node: NodeDomain,
    private database: DatabaseDomain,
  ) {}

  initNodes = async (userId: string) => {
    await this.penx.node.add(
      getCommonNode(
        {
          userId,
          type: NodeType.ROOT,
        },
        '',
      ),
    )

    // init inbox node
    await this.node.createInboxNode(userId)

    // init trash node
    await this.penx.node.add(
      getNewNode({
        userId,
        type: NodeType.TRASH,
      }),
    )

    // init favorite node
    await this.penx.node.add(
      getNewNode({
        userId,
        type: NodeType.FAVORITE,
      }),
    )

    // init database root node
    await this.penx.node.add(
      getNewNode({
        userId,
        type: NodeType.DATABASE_ROOT,
      }),
    )

    // init daily root node
    const dailyRoot = await this.node.createNode(
      getNewNode({
        userId,
        type: NodeType.DAILY_ROOT,
      }),
    )

    const node = await this.node.createDailyNode(
      getNewNode({
        parentId: dailyRoot.id,
        userId,
        type: NodeType.DAILY,
        date: formatToDate(new Date()),
      }),
    )

    await this.database.createDatabase({
      userId,
      name: TODO_DATABASE_NAME,
    })

    await this.database.createDatabase({
      userId,
      name: FILE_DATABASE_NAME,
    })
  }
}

export const initDomain = new InitDomain(penxDB, nodeDomain, databaseDomain)
