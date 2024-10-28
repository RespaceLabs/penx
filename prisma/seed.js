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

  if (!site) {
    return await prisma.site.create({
      data: {
        name: 'My first site',
        description: 'This is my first site',
        authSecret: secret,
        socials: {},
        config: {},
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
