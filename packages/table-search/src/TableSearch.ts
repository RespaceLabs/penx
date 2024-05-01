import { Node } from 'slate'
import { ICellNodeProps, INode } from '@penx/model-types'
import { Filter, OperatorType } from '@penx/model-types/src/interfaces/INode'
import { store } from '@penx/store'

const getTextFromChildren = (children: any[], renderTag: boolean) => {
  if (!renderTag) {
    const notRenderTagChildren = children.filter(
      (item: any) => item?.type !== 'tag',
    ) as { text: string; type?: string }[]
    return notRenderTagChildren.map((item) => item.text).join('')
  }

  return children.reduce((acc: string, child: any) => {
    if (child?.type === 'tag') {
      return acc + ('#' + child?.name || '')
    }
    return acc + Node.string(child)
  }, '')
}

const generateNoteCellText = (ref: string, renderTag = true): string => {
  const node = store.node.getNode(ref)

  if (!node?.element) {
    return 'EMPTY'
  }

  const elements = Array.isArray(node.element) ? node.element : [node.element]

  const text = elements
    .map((element: any) => {
      if (Array.isArray(element.children)) {
        return getTextFromChildren(element.children, renderTag)
      } else {
        return Node.string(element)
      }
    })
    .join('')

  return text
}

interface ISearchNode {
  id: string
  text: string
}

export class TableSearch {
  private static instance: TableSearch
  searchNodes: Map<string, Map<string, ISearchNode[]>>
  dataSourceMap: Map<string, Map<string, INode>>
  isDatabaseId: boolean

  constructor(dataSource: INode[], databaseId: string, isDatabaseId: boolean) {
    this.dataSourceMap = new Map()
    this.searchNodes = new Map()
    this.isDatabaseId = isDatabaseId

    this.initialize(dataSource, databaseId)
  }

  public static initTableSearch(
    dataSource: INode[],
    databaseId: string,
    isDatabaseId = true,
    isRebuild = false,
  ) {
    if (!this.instance) {
      this.instance = new TableSearch(dataSource, databaseId, isDatabaseId)
    } else if (this.instance && !this.instance.dataSourceMap.has(databaseId)) {
      this.instance.initialize(dataSource, databaseId)
    } else if (isRebuild) {
      if (this.instance.dataSourceMap.has(databaseId)) {
        this.instance.dataSourceMap.delete(databaseId)
        this.instance.searchNodes.delete(databaseId)
      }
      this.instance.initialize(dataSource, databaseId)
    }

    return this.instance
  }

  public static getInstance(): TableSearch {
    return this.instance
  }

  private initialize(dataSource: INode[], databaseId: string): void {
    if (!dataSource.length) {
      return
    }

    if (!this.dataSourceMap.has(databaseId)) {
      this.dataSourceMap.set(databaseId, new Map())
    }

    if (!this.searchNodes.has(databaseId)) {
      this.searchNodes.set(databaseId, new Map())
    }

    const searchNodesInner = this.searchNodes.get(databaseId) as Map<
      string,
      ISearchNode[]
    >

    const spaceNode = dataSource[0]
    const keys = Object.keys(spaceNode ? spaceNode : [])

    dataSource.forEach((item) => {
      this.dataSourceMap.get(databaseId)?.set(item.id, item)
      keys.forEach((property) => {
        let text = ''

        if (this.isDatabaseId && property === 'props') {
          const cellNodeProps = (item as any)[property] as ICellNodeProps
          text = cellNodeProps?.ref
            ? generateNoteCellText(cellNodeProps.ref, false)
            : cellNodeProps?.data

          if (typeof text === 'object') {
            text = JSON.stringify(text)
          }

          this.insert(
            cellNodeProps.columnId,
            // text ? text.trim() : 'EMPTY',
            //TODO:
            text ? String(text).trim() : 'EMPTY',
            item.id,
            searchNodesInner,
          )
        } else {
          const propertyValue = (item as any)[property]
          if (typeof propertyValue === 'object') {
            text = JSON.stringify(propertyValue)
          } else if (typeof propertyValue === 'boolean') {
            text = propertyValue.toString()
          } else {
            text = propertyValue
          }
        }

        this.insert(
          property,
          // text ? text.trim() : 'EMPTY',
          text ? String(text).trim() : 'EMPTY',
          item.id,
          searchNodesInner,
        )
      })
    })
  }

  private insert(
    property: string,
    text: string,
    id: string,
    searchNodesInner: Map<string, ISearchNode[]>,
  ) {
    const searchNode = searchNodesInner.get(property)
    if (searchNode) {
      searchNode.push({ id, text })
    } else {
      searchNodesInner.set(property, [{ id, text }])
    }
  }

  public search(
    filters: Filter[],
    databaseId: string,
  ): { cellnodes: INode[]; rowKeys: string[] } {
    const cellnodes: INode[] = []
    const rowKeys: string[] = []

    if (
      !this.searchNodes.has(databaseId) ||
      !this.dataSourceMap.has(databaseId)
    ) {
      return {
        cellnodes: [],
        rowKeys: [],
      }
    }

    filters.forEach((item) => {
      if (item.operator === OperatorType.EQUAL) {
        const { rowsKey, nodes } = this.exactMatch(item, databaseId)
        cellnodes.push(...nodes)
        rowKeys.push(...rowsKey)
      } else if (item.operator === OperatorType.CONTAINS) {
        const { rowsKey, nodes } = this.fuzzySearch(item, databaseId)
        cellnodes.push(...nodes)
        rowKeys.push(...rowsKey)
      }
    })

    return { cellnodes, rowKeys }
  }

  private getFilteredNodes(
    nodeCollector: ISearchNode[],
    dataSourceMap: Map<string, INode>,
    processNode: (item: ISearchNode) => boolean,
  ): { nodes: INode[]; rowsKey: string[] } {
    const matchIds = nodeCollector.filter(processNode)

    const nodes = matchIds.map((item) => dataSourceMap.get(item.id)) as INode[]
    const rowsKey = nodes.reduce((result: string[], item: INode) => {
      if (!this.isDatabaseId) {
        result.push(item.id)
      } else if (item.props?.rowId) {
        result.push(item.props?.rowId)
      }

      return result
    }, [])

    return {
      nodes,
      rowsKey,
    }
  }

  private fuzzySearch(
    filter: Filter,
    databaseId: string,
  ): { nodes: INode[]; rowsKey: string[] } {
    const dataSourceMap = this.dataSourceMap.get(databaseId) as Map<
      string,
      INode
    >
    const searchNodes = this.searchNodes.get(databaseId) as Map<
      string,
      ISearchNode[]
    >
    const nodeCollector = searchNodes.get(filter.columnId) || []

    return this.getFilteredNodes(nodeCollector, dataSourceMap, (item) =>
      new RegExp(filter.value, 'i').test(item.text),
    )
  }

  private exactMatch(
    filter: Filter,
    databaseId: string,
  ): { nodes: INode[]; rowsKey: string[] } {
    const dataSourceMap = this.dataSourceMap.get(databaseId) as Map<
      string,
      INode
    >
    const searchNodes = this.searchNodes.get(databaseId) as Map<
      string,
      ISearchNode[]
    >
    const nodeCollector = searchNodes.get(filter.columnId) || []

    return this.getFilteredNodes(
      nodeCollector,
      dataSourceMap,
      (item) => item.text === filter.value,
    )
  }
}
