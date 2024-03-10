import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.query.id as string
  res.json({
    description: 'PenX believer NFT',
    external_url: '',
    image: `https://penx.io/images/nft/penx-believer-nft-${id}.png`,
    name: 'PenX believer NFT',
    attributes: [],
  })
}
