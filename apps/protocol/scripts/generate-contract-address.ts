import jetpack from 'fs-jetpack'
import { join } from 'path'

const cwd = process.cwd()
// const files = jetpack.find(join(cwd, 'deployments', 'localhost'), { matching: '*.json' })
const files = jetpack.find(join(cwd, 'deployments', 'sepolia'), { matching: '*.json' })

const addressMap = files.reduce<Record<string, string>>((acc, file) => {
  const json = jetpack.read(file, 'json')
  if (json?.address) {
    const [, name] = file.match(/.*\/(.*)\.json$/) || []
    if (name) acc[name] = json.address
  }
  return acc
}, {})

jetpack.write(
  join(cwd, 'abi', 'address.ts'),
  `
    export const json = ${JSON.stringify(addressMap, null, 2)}
    export const addressMap: Record<keyof typeof json, any> = json
  `,
)
