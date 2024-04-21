import { prisma } from '@penx/db'

export async function initMySQL() {
  if (!process.env.DATABASE_URL) return

  // create table
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(191) NOT NULL,
        address VARCHAR(191) NULL,
        name VARCHAR(191) NULL,
        bio VARCHAR(191) NULL,
        avatar VARCHAR(191) NULL,
        password VARCHAR(191) NULL,
        roleType VARCHAR(191) NULL,
        github JSON NULL,
        google JSON NULL,
        taskGithub JSON NULL,
        username VARCHAR(191) NULL,
        email VARCHAR(191) NULL,
        emailVerified DATETIME(3) NULL,
        image VARCHAR(191) NULL,
        earlyAccessCode VARCHAR(191) NULL,
        publicKey VARCHAR(191) NULL,
        isMnemonicBackedUp BOOLEAN NOT NULL DEFAULT false,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        connectedSyncServerId VARCHAR(191) NULL,

        UNIQUE INDEX user_address_key(address),
        UNIQUE INDEX user_email_key(email),
        INDEX user_id_idx(id),
        INDEX user_address_idx(address),
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS account (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      type VARCHAR(191) NOT NULL,
      provider VARCHAR(191) NOT NULL,
      providerAccountId VARCHAR(191) NOT NULL,
      refresh_token VARCHAR(191) NULL,
      access_token VARCHAR(191) NULL,
      refresh_token_expires_in INTEGER NULL,
      expires_at INTEGER NULL,
      token_type VARCHAR(191) NULL,
      scope VARCHAR(191) NULL,
      id_token VARCHAR(191) NULL,
      session_state VARCHAR(191) NULL,
      oauth_token_secret VARCHAR(191) NULL,
      oauth_token VARCHAR(191) NULL,

      INDEX account_userId_idx(userId),
      UNIQUE INDEX account_provider_providerAccountId_key(provider, providerAccountId),
      PRIMARY KEY (id)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS session (
        id VARCHAR(191) NOT NULL,
        sessionToken VARCHAR(191) NOT NULL,
        userId VARCHAR(191) NOT NULL,
        expires DATETIME(3) NOT NULL,

        UNIQUE INDEX session_sessionToken_key(sessionToken),
        INDEX session_userId_idx(userId),
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS verification_token (
        identifier VARCHAR(191) NOT NULL,
        token VARCHAR(191) NOT NULL,
        expires DATETIME(3) NOT NULL,

        UNIQUE INDEX verification_token_token_key(token),
        UNIQUE INDEX verification_token_identifier_token_key(identifier, token)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS personal_token (
        id VARCHAR(191) NOT NULL,
        userId VARCHAR(191) NOT NULL,
        value VARCHAR(191) NOT NULL,
        type VARCHAR(191) NULL,
        description VARCHAR(191) NULL,
        createdAt DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NULL,

        UNIQUE INDEX personal_token_value_key(value),
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS sync_server (
        id VARCHAR(191) NOT NULL,
        name VARCHAR(191) NOT NULL,
        url VARCHAR(191) NULL,
        token VARCHAR(191) NOT NULL,
        description TEXT NULL,
        region VARCHAR(191) NULL,
        type VARCHAR(191) NULL,
        machineIp VARCHAR(191) NULL,
        heartbeatAt DATETIME(3) NULL,
        userCount INTEGER NOT NULL DEFAULT 0,
        spaceCount INTEGER NOT NULL DEFAULT 0,
        nodeCount INTEGER NOT NULL DEFAULT 0,
        deletedAt DATETIME(3) NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        userId VARCHAR(191) NOT NULL,

        UNIQUE INDEX sync_server_token_key(token),
        INDEX sync_server_userId_idx(userId),
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS space (
        id VARCHAR(191) NOT NULL,
        name VARCHAR(191) NOT NULL,
        description TEXT NULL,
        subdomain VARCHAR(191) NULL,
        customDomain VARCHAR(191) NULL,
        editorMode VARCHAR(191) NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        color VARCHAR(191) NOT NULL,
        encrypted BOOLEAN NOT NULL DEFAULT false,
        activeNodeIds JSON NULL,
        nodeSnapshot JSON NULL,
        pageSnapshot JSON NULL,
        syncedNodesCount INTEGER NOT NULL DEFAULT 0,
        deletedAt DATETIME(3) NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        userId VARCHAR(191) NULL,
        runnerId VARCHAR(191) NULL,

        UNIQUE INDEX space_subdomain_key(subdomain),
        UNIQUE INDEX space_customDomain_key(customDomain),
        INDEX space_userId_idx(userId),
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `

  await prisma.$executeRaw`
    ALTER TABLE account ADD CONSTRAINT account_userId_fkey FOREIGN KEY (userId) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE;
  `

  await prisma.$executeRaw`
    ALTER TABLE session ADD CONSTRAINT session_userId_fkey FOREIGN KEY (userId) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE;
  `

  await prisma.$executeRaw`
    ALTER TABLE sync_server ADD CONSTRAINT sync_server_userId_fkey FOREIGN KEY (userId) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE;
  `

  await prisma.$executeRaw`
    ALTER TABLE space ADD CONSTRAINT space_userId_fkey FOREIGN KEY (userId) REFERENCES user(id) ON DELETE SET NULL ON UPDATE CASCADE;
  `
}
