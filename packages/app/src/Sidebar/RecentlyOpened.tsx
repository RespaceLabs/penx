import { DocQuery } from './DocQuery'

const sql = 'SELECT * FROM doc ORDER BY openedAt DESC limit 4'

export const RecentlyOpened = () => {
  return <DocQuery sql={sql} title="Recently Edited" />
}
