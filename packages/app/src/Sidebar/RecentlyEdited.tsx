import { NodeQuery } from './NodeQuery/NodeQuery'

const sql = 'SELECT * FROM node ORDER BY updatedAt DESC limit 20'

export const RecentlyEdited = () => {
  return <NodeQuery sql={sql} title="Recently Edited" />
}
