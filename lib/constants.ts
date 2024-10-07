import { Address } from 'viem'

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export const SPACE_ID = process.env.NEXT_PUBLIC_SPACE_ID as Address

export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY!

export const editorDefaultValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '',
        },
      ],
    },
  ],
}
