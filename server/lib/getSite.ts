import { prisma } from '@/lib/prisma'
import { Site } from '@prisma/client'

export async function getSite() {
  const site = await prisma.site.findFirst()

  if (!site) {
    return {
      name: 'Site Name',
      description: 'Description of your site',
      about: '',
      logo: 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png',
      font: '',
      image: '',
      socials: {},
      config: {},
    } as Site
  }

  return site
}
