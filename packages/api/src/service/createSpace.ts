import { nanoid } from 'nanoid'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { RoleType } from '../constants'

const EDITOR_CONTENT = [
  {
    type: 'p',
    id: nanoid(),
    children: [{ text: 'A page' }],
  },
]

export const CreateUserInput = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
})

export type CreateUserInput = z.infer<typeof CreateUserInput>

export function createSpace(input: CreateUserInput) {
  const { userId } = input
  return prisma.$transaction(
    async (tx: any) => {
      const space = await tx.space.create({
        data: { subdomain: nanoid(), ...input },
      })

      const { id: spaceId } = space

      const pageHome = await tx.page.create({
        data: {
          spaceId,
          title: 'Home',
          pathname: '/',
          content: JSON.stringify(EDITOR_CONTENT),
        },
      })

      // Init pages
      const [_, doc] = await Promise.all([
        tx.page.create({
          data: {
            spaceId,
            title: 'Doc content',
            pathname: '/[docId]',
            content: JSON.stringify(EDITOR_CONTENT),
          },
        }),

        // init docs
        tx.doc.create({
          data: {
            userId,
            spaceId: space.id,
            title: 'Untitled',
            content: JSON.stringify(EDITOR_CONTENT),
            slug: nanoid(),
          },
        }),

        tx.member.create({
          data: {
            userId,
            spaceId,
            roleType: RoleType.Owner,
          },
        }),
      ])

      await tx.space.update({
        where: { id: space.id },
        data: {
          homePageId: pageHome.id,
          catalogue: JSON.stringify([
            {
              id: doc.slug,
              isFolded: false,
              name: doc.title,
              type: 0,
              url: '',
            },
          ]),
        },
      })

      return space
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
