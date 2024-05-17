import ky from 'ky'
import { IExtension } from '@penx/model-types'

export async function fetchInstallationJSON(id: string) {
  try {
    const json = await ky
      .get(
        `https://raw.githubusercontent.com/penxio/marketplace/main/extensions/${id}/installation.json`,
      )
      .json()

    return json as IExtension
  } catch (error) {
    return null
  }
}
