-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "figmaUrl" TEXT,
    "issueUrl" TEXT,
    "prUrl" TEXT,
    "usdReward" INTEGER NOT NULL,
    "tokenReward" INTEGER NOT NULL,
    "claimStage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bounty" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "issueUrl" TEXT,
    "prUrl" TEXT,
    "rewards" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "bounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "runner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "machineIp" TEXT,
    "heartbeatAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "runner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "node" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "parentId" TEXT,
    "databaseId" TEXT,
    "type" TEXT NOT NULL,
    "element" JSONB NOT NULL,
    "props" JSONB,
    "collapsed" BOOLEAN NOT NULL DEFAULT false,
    "folded" BOOLEAN NOT NULL DEFAULT true,
    "children" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_space" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subdomain" TEXT,
    "customDomain" TEXT,
    "editorMode" TEXT,
    "color" TEXT NOT NULL,
    "activeNodeIds" JSONB,
    "nodeSnapshot" JSONB,
    "pageSnapshot" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "site_space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_node" (
    "id" TEXT NOT NULL,
    "siteSpaceId" TEXT NOT NULL,
    "parentId" TEXT,
    "databaseId" TEXT,
    "type" TEXT NOT NULL,
    "element" JSONB NOT NULL,
    "props" JSONB,
    "collapsed" BOOLEAN NOT NULL DEFAULT false,
    "folded" BOOLEAN NOT NULL DEFAULT true,
    "children" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "published_node" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "password" TEXT,
    "reviewable" BOOLEAN NOT NULL DEFAULT false,
    "editable" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "published_node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "introduction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "readme" TEXT,
    "code" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "roleType" TEXT,
    "token" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "invitation_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_id_idx" ON "user"("id");

-- CreateIndex
CREATE INDEX "user_address_idx" ON "user"("address");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "personal_token_value_key" ON "personal_token"("value");

-- CreateIndex
CREATE UNIQUE INDEX "sync_server_token_key" ON "sync_server"("token");

-- CreateIndex
CREATE INDEX "sync_server_userId_idx" ON "sync_server"("userId");

-- CreateIndex
CREATE INDEX "runner_userId_idx" ON "runner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "space_subdomain_key" ON "space"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "space_customDomain_key" ON "space"("customDomain");

-- CreateIndex
CREATE INDEX "space_userId_idx" ON "space"("userId");

-- CreateIndex
CREATE INDEX "node_spaceId_idx" ON "node"("spaceId");

-- CreateIndex
CREATE INDEX "node_type_idx" ON "node"("type");

-- CreateIndex
CREATE UNIQUE INDEX "site_space_subdomain_key" ON "site_space"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "site_space_customDomain_key" ON "site_space"("customDomain");

-- CreateIndex
CREATE INDEX "site_space_userId_idx" ON "site_space"("userId");

-- CreateIndex
CREATE INDEX "site_node_siteSpaceId_idx" ON "site_node"("siteSpaceId");

-- CreateIndex
CREATE INDEX "site_node_type_idx" ON "site_node"("type");

-- CreateIndex
CREATE UNIQUE INDEX "published_node_nodeId_key" ON "published_node"("nodeId");

-- CreateIndex
CREATE INDEX "published_node_spaceId_idx" ON "published_node"("spaceId");

-- CreateIndex
CREATE INDEX "published_node_nodeId_idx" ON "published_node"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "published_node_spaceId_nodeId_key" ON "published_node"("spaceId", "nodeId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_server" ADD CONSTRAINT "sync_server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "runner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_space" ADD CONSTRAINT "site_space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
