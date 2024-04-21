-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
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

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PersonalToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PersonalToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
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

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bounty" (
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

    CONSTRAINT "Bounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncServer" (
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

    CONSTRAINT "SyncServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "machineIp" TEXT,
    "heartbeatAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Runner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
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

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
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

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSpace" (
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

    CONSTRAINT "SiteSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteNode" (
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

    CONSTRAINT "SiteNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedNode" (
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

    CONSTRAINT "PublishedNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "password" TEXT,
    "reviewable" BOOLEAN NOT NULL DEFAULT false,
    "editable" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "introduction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extension" (
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

    CONSTRAINT "Extension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "roleType" TEXT,
    "token" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "InvitationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_address_idx" ON "User"("address");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalToken_value_key" ON "PersonalToken"("value");

-- CreateIndex
CREATE UNIQUE INDEX "SyncServer_token_key" ON "SyncServer"("token");

-- CreateIndex
CREATE INDEX "SyncServer_userId_idx" ON "SyncServer"("userId");

-- CreateIndex
CREATE INDEX "Runner_userId_idx" ON "Runner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_subdomain_key" ON "Space"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Space_customDomain_key" ON "Space"("customDomain");

-- CreateIndex
CREATE INDEX "Space_userId_idx" ON "Space"("userId");

-- CreateIndex
CREATE INDEX "Node_spaceId_idx" ON "Node"("spaceId");

-- CreateIndex
CREATE INDEX "Node_type_idx" ON "Node"("type");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSpace_subdomain_key" ON "SiteSpace"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSpace_customDomain_key" ON "SiteSpace"("customDomain");

-- CreateIndex
CREATE INDEX "SiteSpace_userId_idx" ON "SiteSpace"("userId");

-- CreateIndex
CREATE INDEX "SiteNode_siteSpaceId_idx" ON "SiteNode"("siteSpaceId");

-- CreateIndex
CREATE INDEX "SiteNode_type_idx" ON "SiteNode"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedNode_nodeId_key" ON "PublishedNode"("nodeId");

-- CreateIndex
CREATE INDEX "PublishedNode_spaceId_idx" ON "PublishedNode"("spaceId");

-- CreateIndex
CREATE INDEX "PublishedNode_nodeId_idx" ON "PublishedNode"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedNode_spaceId_nodeId_key" ON "PublishedNode"("spaceId", "nodeId");

-- CreateIndex
CREATE INDEX "Post_spaceId_idx" ON "Post"("spaceId");

-- CreateIndex
CREATE INDEX "Post_nodeId_idx" ON "Post"("nodeId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncServer" ADD CONSTRAINT "SyncServer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSpace" ADD CONSTRAINT "SiteSpace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
