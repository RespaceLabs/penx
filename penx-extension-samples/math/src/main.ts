import { input } from '@penx/extension-api'

async function main() {
  console.log('input....123:', input)

  postMessage({
    type: 'list',
    items: [
      {
        title: input,
      },
    ],
  })
}

main()
