import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { create, globSource } from 'kubo-rpc-client'
import { nanoid } from 'nanoid'

async function main() {
  const client = create(new URL('http://43.154.135.183:5001'))
  // const client = create(new URL("http://127.0.0.1:5001"));

  let distCID = ''

  console.log('IPFS_UPLOADING')

  for await (const file of client.addAll(
    globSource('./', 'out/**/*', {
      // preserveMode: true,
      hidden: false,
    }),
    { pin: true }
  )) {
    if (file.path.endsWith('.html')) {
      // console.log(file, file.cid.toString())
    }
    if (file.path === 'out') {
      console.log(file, file.cid.toString())
      distCID = file.cid.toString()
    }
  }

  console.log('distCID======:', distCID)

  console.log('IPFS_UPLOADED')

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const pkgPath = path.join(__dirname, 'package.json')

  const fileContents = fs.readFileSync(pkgPath, 'utf8')
  const pkg = JSON.parse(fileContents)
  pkg.cid = distCID

  let key = pkg.key

  try {
    if (!key) {
      key = nanoid()
    }
    await client.key.gen(key)
    console.log('key', key)
  } catch (error) {
    console.log('===error:', error)
  }

  console.log('current=====key:', key)

  console.log('IPNS_PUBLISHING')
  const ipns = await client.name.publish(distCID, {
    key: key,
    // lifetime: '1m',
    // ttl: '1m',
  })

  console.log('IPNS_PUBLISHED')

  console.log('PUBLISHING')

  try {
    const res = await fetch('https://www.plantree.xyz/api/cid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cid: distCID }),
    }).then((response) => response.json())

    console.log('res>>>>>>>>>>>>', res)
  } catch (error) {
    //
  }

  fs.writeFileSync(
    pkgPath,
    JSON.stringify(
      {
        ...pkg,
        key: key,
        cid: distCID,
        ipns: ipns.name,
      },
      null,
      2
    )
  )

  console.log('PUBLISHED')
}

main()
