import { INode } from '@penx/model-types'

interface ISearchNode {
  id: string
  text: string
}

export class TableSearch {
  searchNodes: Map<string, ISearchNode[]>
  viewColumnsMap: Map<string, string>
  dataSourceMap: Map<string, INode>

  constructor(dataSource: INode[], viewColumnsIndexes: string[]) {
    this.viewColumnsMap = viewColumnsIndexes.reduce((map, val) => {
      map.set(val, val)
      return map
    }, new Map<string, string>())
    this.dataSourceMap = new Map<string, INode>()
    // Indexes that store different fields
    this.searchNodes = new Map<string, ISearchNode[]>()

    const columnKey = viewColumnsIndexes.length ? viewColumnsIndexes[0] : ''
    this.initialize(dataSource, columnKey)
  }

  initialize(dataSource: INode[], columnKey: string): void {
    if (!columnKey && !dataSource.length) {
      return
    }

    const spaceNode = dataSource[0]
    const keys = Object.keys(spaceNode)
    console.log('%c=initialize===>1', 'color:red', { spaceNode, keys })

    dataSource.forEach((item) => {
      this.dataSourceMap.set(item.id, item)
      keys.forEach((property) => {
        let text = ''
        if (typeof (item as any)[property] === 'object') {
          text = JSON.stringify((item as any)[property])
        } else if (typeof (item as any)[property] === 'boolean') {
          text = (item as any)[property].toString()
        } else {
          text = (item as any)[property]
        }

        this.insert(property, text, item.id)

        console.log('%c=final=====>', 'color:MediumBlue	', this.searchNodes)
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

  fuzzySearch(property: string, text: string) {
    const regex = new RegExp(text, 'i')

    // data.filter(item => regex.test(item[property]));
    return []
  }
}
