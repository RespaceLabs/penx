import { spaceAbi } from '@/lib/abi'
import { getSession } from '@/lib/auth'
import { GateType, SPACE_ID } from '@/lib/constants'
import { getPost, getPosts } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { wagmiConfig } from '@/lib/wagmi'
import { TipTapNode } from '@plantreexyz/types'
import { Post } from '@prisma/client'
import { readContract } from '@wagmi/core'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'
import { Address } from 'viem'
import { GateCover } from './GateCover'

export function PaidChecker() {
  //
}
