import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log:
    //   process.env.NODE_ENV === 'development'
    //     ? ['query', 'error', 'warn']
    //     : ['error'],
    log: [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
