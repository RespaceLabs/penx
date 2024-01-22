import { ICellNodePopps, INode } from '@penx/model-types'
import { Filter, OperatorType } from '@penx/model-types/src/interfaces/INode'
import { generateNoteCellText } from './cells/note-cell'

interface ISearchNode {
  id: string
  text: string
}

export class TableSearch {
  private static instance: TableSearch
  searchNodes: Map<string, ISearchNode[]>
  dataSourceMap: Map<string, INode>

  constructor(dataSource: INode[]) {
    this.dataSourceMap = new Map<string, INode>()
    // Indexes that store different fields
    this.searchNodes = new Map<string, ISearchNode[]>()

    this.initialize(dataSource)
  }

  public static initTableSearch(dataSource: INode[]) {
    if (!this.instance) {
      this.instance = new TableSearch(dataSource)
    }

    return this.instance
  }

  public static getInstance(): TableSearch {
    return this.instance
  }

  initialize(dataSource: INode[]): void {
    if (!dataSource.length) {
      return
    }

    const spaceNode = dataSource[0]
    const keys = Object.keys(spaceNode ? spaceNode : [])

    dataSource.forEach((item) => {
      this.dataSourceMap.set(item.id, item)

      keys.forEach((property) => {
        let text = ''

        if (property === 'props') {
          const cellNodeProps = (item as any)[property] as ICellNodePopps
          text = cellNodeProps?.ref
            ? generateNoteCellText(cellNodeProps.ref, false)
            : cellNodeProps?.data
          this.insert(cellNodeProps.columnId, text.trim(), item.id)
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

        this.insert(property, text.trim(), item.id)
      })
    })
  }

  insert(property: string, text: string, id: string) {
    const searchNode = this.searchNodes.get(property)
    if (searchNode) {
      searchNode.push({ id, text })
    } else {
      this.searchNodes.set(property, [{ id, text }])
    }
  }

  search(filters: Filter[]): { cellnodes: INode[]; rowKeys: string[] } {
    const cellnodes: INode[] = []
    const rowKeys: string[] = []
    filters.forEach((item) => {
      if (item.operator === OperatorType.EQUAL) {
        const { rowsKey, nodes } = this.exactMatch(item)
        cellnodes.push(...nodes)
        rowKeys.push(...rowsKey)
      } else if (item.operator === OperatorType.CONTAINS) {
        const { rowsKey, nodes } = this.fuzzySearch(item)
        cellnodes.push(...nodes)
        rowKeys.push(...rowsKey)
      }
    })

    return { cellnodes, rowKeys }
  }

  fuzzySearch(filter: Filter): { nodes: INode[]; rowsKey: string[] } {
    const nodeCollector = this.searchNodes.get(filter.columnId) || []
    const regex = new RegExp(filter.value, 'i')
    const matchIds = nodeCollector.filter((item) => {
      return regex.test(item.text)
    })

    const nodes = matchIds.map((item) =>
      this.dataSourceMap.get(item.id),
    ) as INode[]

    return {
      nodes,
      rowsKey: nodes.map((item) => item.props?.rowId),
    }
  }

  exactMatch(filter: Filter): { nodes: INode[]; rowsKey: string[] } {
    const nodeCollector = this.searchNodes.get(filter.columnId) || []
    const matchIds = nodeCollector.filter((item) => item.text === filter.value)
    const nodes = matchIds.map((item) =>
      this.dataSourceMap.get(item.id),
    ) as INode[]

    return {
      nodes,
      rowsKey: nodes.map((item) => item.props?.rowId),
    }
  }
}
