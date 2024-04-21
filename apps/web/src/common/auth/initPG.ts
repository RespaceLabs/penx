import { prisma } from '@penx/db'

export async function initPG() {
  if (!process.env.DATABASE_URL) return

  // create table
  await prisma.$executeRaw`
    CREATE TABLE "user" (
        "id" TEXT NOT NULL,
        "address" TEXT,
        "name" TEXT,
        "bio" TEXT,
        "avatar" TEXT,
        "password" TEXT,
        "roleType" TEXT,
        "github" JSONB,
        "google" JSONB,
        "taskGithub" JSONB,
        "username" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "earlyAccessCode" TEXT,
        "publicKey" TEXT,
        "isMnemonicBackedUp" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "connectedSyncServerId" TEXT,

        CONSTRAINT "user_pkey" PRIMARY KEY ("id")
    );
  `

  await prisma.$executeRaw`
    CREATE TABLE "account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "refresh_token_expires_in" INTEGER,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        "oauth_token_secret" TEXT,
        "oauth_token" TEXT,

        CONSTRAINT "account_pkey" PRIMARY KEY ("id")
    );
  `

  await prisma.$executeRaw`
    CREATE TABLE "session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "session_pkey" PRIMARY KEY ("id")
    );
  `

  await prisma.$executeRaw`
    CREATE TABLE "verification_token" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
    );
  `

  await prisma.$executeRaw`
  `

  await prisma.$executeRaw`
    CREATE TABLE "personal_token" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "type" TEXT,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3),

        CONSTRAINT "personal_token_pkey" PRIMARY KEY ("id")
    );

  `

  await prisma.$executeRaw`
    CREATE TABLE "sync_server" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "url" TEXT,
        "token" TEXT NOT NULL,
        "description" TEXT,
        "region" TEXT,
        "type" TEXT,
        "machineIp" TEXT,
        "heartbeatAt" TIMESTAMP(3),
        "userCount" INTEGER NOT NULL DEFAULT 0,
        "spaceCount" INTEGER NOT NULL DEFAULT 0,
        "nodeCount" INTEGER NOT NULL DEFAULT 0,
        "deletedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT NOT NULL,

        CONSTRAINT "sync_server_pkey" PRIMARY KEY ("id")
    );
  `

  await prisma.$executeRaw`
    CREATE TABLE "space" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "subdomain" TEXT,
        "customDomain" TEXT,
        "editorMode" TEXT,
        "sort" INTEGER NOT NULL DEFAULT 0,
        "color" TEXT NOT NULL,
        "encrypted" BOOLEAN NOT NULL DEFAULT false,
        "activeNodeIds" JSONB,
        "nodeSnapshot" JSONB,
        "pageSnapshot" JSONB,
        "syncedNodesCount" INTEGER NOT NULL DEFAULT 0,
        "deletedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT,
        "runnerId" TEXT,

        CONSTRAINT "space_pkey" PRIMARY KEY ("id")
    );
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
  `

  await prisma.$executeRaw`
    CREATE INDEX "user_id_idx" ON "user"("id");
  `

  await prisma.$executeRaw`
    CREATE INDEX "user_address_idx" ON "user"("address");
  `

  await prisma.$executeRaw`
    CREATE INDEX "account_userId_idx" ON "account"("userId");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");
  `

  await prisma.$executeRaw`
    CREATE INDEX "session_userId_idx" ON "session"("userId");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "personal_token_value_key" ON "personal_token"("value");
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX "sync_server_token_key" ON "sync_server"("token");
  `

  await prisma.$executeRaw`
    CREATE INDEX "sync_server_userId_idx" ON "sync_server"("userId");
  `

  await prisma.$executeRaw`
    CREATE INDEX "space_userId_idx" ON "space"("userId");
  `

  await prisma.$executeRaw`
    ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `

  await prisma.$executeRaw`
    ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `

  await prisma.$executeRaw`
    ALTER TABLE "sync_server" ADD CONSTRAINT "sync_server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  `

  await prisma.$executeRaw`
    ALTER TABLE "space" ADD CONSTRAINT "space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `
}
