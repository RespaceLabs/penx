import { DocQuery } from './DocQuery'

const sql = 'SELECT * FROM doc ORDER BY updatedAt DESC limit 20'

export const RecentlyEdited = () => {
  return <DocQuery sql={sql} title="Recently Edited" />
}
