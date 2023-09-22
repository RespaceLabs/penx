import { EditorApp, initFower } from '@penx/app'
import { db } from '@penx/local-db'
import './globals.css'

db.init()

initFower()

function IndexNewtab() {
  return <EditorApp />
}

export default IndexNewtab
