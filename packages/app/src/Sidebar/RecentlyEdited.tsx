import { DocQuery } from './DocQuery/DocQuery'

const sql = 'SELECT * FROM doc ORDER BY updatedAt DESC limit 10'

export const RecentlyEdited = () => {
  return <DocQuery sql={sql} title="Recently Edited" />
}
