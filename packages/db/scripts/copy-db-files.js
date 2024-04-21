/* eslint-disable no-console */
const fse = require('fs-extra')
const path = require('path')

function getDatabaseType(url = process.env.DATABASE_URL) {
  const type = process.env.DATABASE_TYPE || (url && url.split(':')[0])

  if (type === 'postgres') {
    return 'postgresql'
  }

  return type
}

const databaseType = getDatabaseType()

if (!databaseType || !['mysql', 'postgresql'].includes(databaseType)) {
  throw new Error('Missing or invalid database')
}

console.log(`Database type detected: ${databaseType}`)

const src = path.join(__dirname, `../${databaseType}`)

const dest = path.join(__dirname, '../prisma')

fse.removeSync(dest)
fse.copySync(src, dest)

console.log(`Copied ${src} to ${dest}`)
