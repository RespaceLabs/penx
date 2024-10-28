const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function genSecret(size = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  // @ts-expect-error
  return Buffer.from(bytes, 'base64').toString('base64')
}

async function main() {
  const site = await prisma.site.findFirst()
  const secret = genSecret()
  console.log('=========>>>>>>>>secret:', secret, secret.length)

  // console.log('site>>>>>:', site)
  if (!site) {
    return await prisma.site.create({
      data: {
        title: 'My first site',
        description: 'This is my first site',
        logo: 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png',
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
