import { editorDefaultValue } from '@/lib/constants'
import { getUrl } from '@/lib/utils'
import { Site } from '@penxio/types'
import { db } from '../db'

export async function getSite() {
  const site = await db.query.sites.findFirst()

  if (!site) {
    return {
      name: 'Site Name',
      description: 'Description of your site',
      about: editorDefaultValue,
      logo: 'https://penx.io/logo.png',
      font: '',
      image: '',
      socials: {},
      config: {},
    } as any as Site
  }

  function getAbout() {
    if (!site?.about) return editorDefaultValue
    try {
      return JSON.parse(site.about)
    } catch (error) {
      return editorDefaultValue
    }
  }

  return {
    ...site,
    logo: getUrl(site.logo || ''),
    image: getUrl(site.image || ''),
    about: getAbout(),
  } as any as Site
}
