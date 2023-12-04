import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

function generateCode(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'

  let code = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters[randomIndex]
  }
  return code
}

export const spaceInvitationCodeRouter = createTRPCRouter({
  generate: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.token.email !== '0xyz.penx@gmail.com') {
      throw new Error('Unauthorized')
    }

    const codes = await ctx.prisma.spaceInvitationCode.findMany()
    const codeSet = new Set(codes.map((i) => i.code))

    const list = Array(10000)
      .fill('')
      .map((_, i) => generateCode(8))
      .filter((i) => !codeSet.has(i))

    await ctx.prisma.spaceInvitationCode.createMany({
      data: list.map((i) => ({ code: i })),
    })

    return true
  }),
})
