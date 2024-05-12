async function main() {
  postMessage({
    type: 'hello',
    items: [
      {
        title: 'hello..',
      },
      {
        title: 'world',
      },
    ],
  })
}

main()
