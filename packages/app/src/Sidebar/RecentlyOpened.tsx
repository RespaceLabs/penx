import { NodeQuery } from './NodeQuery/NodeQuery'

const sql = 'SELECT * FROM doc ORDER BY openedAt DESC limit 4'

export const RecentlyOpened = () => {
  return <NodeQuery sql={sql} title="Recently Opened" />
}
