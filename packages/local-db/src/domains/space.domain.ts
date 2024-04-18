import {
  FILE_DATABASE_NAME,
  LOCAL_USER_ID,
  TODO_DATABASE_NAME,
} from '@penx/constants'
import { ISpace, NodeType } from '@penx/model-types'
import { getLocalSession } from '@penx/storage'
import { formatToDate } from '../libs/formatToDate'
import { getNewNode } from '../libs/getNewNode'
import { getNewSpace } from '../libs/getNewSpace'
import { PenxDB, penxDB } from '../penx-db'
import { databaseDomain, DatabaseDomain } from './database.domain'
import { nodeDomain, NodeDomain } from './node.domain'

export class SpaceDomain {
  constructor(
    private penx: PenxDB,
    private node: NodeDomain,
    private database: DatabaseDomain,
  ) {}

  getLastUpdatedAt = async (spaceId: string): Promise<number> => {
    const oldNodes = await this.node.listNodesBySpaceId(spaceId)

    if (!oldNodes.length) return 0

    const at = Math.max(...oldNodes.map((n) => new Date(n.updatedAt).getTime()))
    return at
  }

  private initSpaceNodes = async (space: ISpace) => {
    const spaceId = space.id
    await this.penx.node.add(
      getNewNode({
        spaceId,
        type: NodeType.ROOT,
      }),
    )

    // init inbox node
    await this.node.createInboxNode(space.id)

    // init trash node
    await this.penx.node.add(
      getNewNode({
        spaceId,
        type: NodeType.TRASH,
      }),
    )

    // init favorite node
    await this.penx.node.add(
      getNewNode({
        spaceId,
        type: NodeType.FAVORITE,
      }),
    )

    // init database root node
    await this.penx.node.add(
      getNewNode({
        spaceId,
        type: NodeType.DATABASE_ROOT,
        props: {
          favorites: [],
        },
      }),
    )

    // init daily root node
    const dailyRoot = await this.node.createNode(
      getNewNode({
        spaceId,
        type: NodeType.DAILY_ROOT,
      }),
    )

    const node = await this.node.createDailyNode(
      getNewNode({
        parentId: dailyRoot.id,
        spaceId,
        type: NodeType.DAILY,
        date: formatToDate(new Date()),
      }),
    )

    await this.updateSpace(spaceId, {
      activeNodeIds: [node.id],
    })

    await this.database.createDatabase({
      spaceId,
      name: TODO_DATABASE_NAME,
    })

    await this.database.createDatabase({
      spaceId,
      name: FILE_DATABASE_NAME,
    })
  }

  createSpace = async (data: Partial<ISpace>, initNode = true) => {
    // insert new space
    const newSpace = getNewSpace(data)
    const spaceId = await this.penx.space.add(newSpace)
    const space = (await this.penx.space.get(spaceId))!

    if (initNode) {
      await this.initSpaceNodes(space)
    }

    return space as ISpace
  }

  createLocalSpace = async () => {
    // Only can create one local space
    const existedSpace = await this.penx.space
      .where({ userId: LOCAL_USER_ID })
      .first()

    if (existedSpace) return existedSpace

    // insert new space
    const newSpace = getNewSpace({
      userId: LOCAL_USER_ID,
      name: 'Local Space',
    })
    const spaceId = await this.penx.space.add(newSpace)
    const space = (await this.penx.space.get(spaceId))!

    await this.initSpaceNodes(space)

    return space as ISpace
  }

  listLocalSpaces = async () => {
    const spaces = await this.penx.space
      .where({ userId: LOCAL_USER_ID })
      .toArray()
    return spaces || []
  }

  listSpaces = async (userId?: string, session?: any) => {
    let spaces: ISpace[] = []
    const localSession = session ?? (await getLocalSession())

    if (localSession) {
      const uid = userId ?? localSession?.userId
      const cloudSpaces = await this.penx.space.where({ userId: uid }).toArray()
      spaces.push(...cloudSpaces)
    }

    const localSpace = await this.listLocalSpaces()

    spaces.push(...localSpace)

    return spaces
  }

  getSpace = (spaceId: string) => {
    return this.penx.space.get(spaceId) as any as Promise<ISpace>
  }

  updateSpace = (spaceId: string, space: Partial<ISpace>) => {
    return this.penx.space.update(spaceId, space)
  }

  deleteSpace = async (spaceId: string) => {
    const nodes = await this.node.listNodesBySpaceId(spaceId)
    for (const node of nodes) {
      await this.penx.node.delete(node.id)
    }
    await this.penx.space.delete(spaceId)
  }
}

export const spaceDomain = new SpaceDomain(penxDB, nodeDomain, databaseDomain)
