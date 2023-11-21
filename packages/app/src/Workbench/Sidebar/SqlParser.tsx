import { AST, Parser, Select } from 'node-sql-parser'

const parser = new Parser()

interface QueryParams {
  sortBy?: any
  orderByDESC?: boolean
  limit?: number
}

export class SqlParser {
  private ast: Select
  constructor(private sql: string) {
    this.ast = parser.astify(sql) as Select
  }

  get isValid() {
    return true
  }

  get tableName(): 'doc' {
    return this.ast?.from?.[0]?.table || ''
  }

  get queryParams(): QueryParams {
    const params: QueryParams = {}
    const limit = this.ast.limit?.value?.[0].value
    if (limit) params.limit = limit

    if (this.ast.orderby?.length) {
      const orderBy = this.ast.orderby[0]
      const sortBy = orderBy.expr.column
      if (sortBy) {
        params.sortBy = sortBy
        params.orderByDESC = orderBy.type.toLowerCase() === 'desc'
      }
    }

    return params
  }
}
