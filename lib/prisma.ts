import { PrismaClient } from '@prisma/client';
import { pagination } from "prisma-extension-pagination";

const prisma = new PrismaClient();

const extendedPrisma = prisma.$extends(pagination());

declare global {
  var prisma: typeof extendedPrisma | undefined;
}

if (process.env.NODE_ENV === 'development') global.prisma = extendedPrisma;

export default extendedPrisma;
export { extendedPrisma as prisma };
