CREATE TABLE `access_token` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text(255) DEFAULT '',
	`alias` text(50),
	`expiresAt` integer,
	`lastUsedAt` integer,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`providerType` text(40),
	`providerAccountId` text(255) DEFAULT '',
	`providerInfo` text,
	`email` text(255),
	`accessToken` text(255),
	`refreshToken` text(255),
	`expiresAt` integer,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `album` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) DEFAULT '' NOT NULL,
	`assetCount` integer DEFAULT 0,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `asset_album` (
	`id` text PRIMARY KEY NOT NULL,
	`assetId` text NOT NULL,
	`labelId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `asset_label` (
	`id` text PRIMARY KEY NOT NULL,
	`assetId` text NOT NULL,
	`labelId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `asset` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`title` text(1000) DEFAULT '',
	`description` text DEFAULT '',
	`contentType` text NOT NULL,
	`isPublic` integer DEFAULT false,
	`isTrashed` integer DEFAULT false,
	`size` integer DEFAULT 0,
	`userId` text NOT NULL,
	`sharingConfig` text,
	`props` text,
	`createdAt` integer,
	`uploadedAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `block` (
	`id` text PRIMARY KEY NOT NULL,
	`pageId` text NOT NULL,
	`parentId` text,
	`type` text,
	`collapsed` integer DEFAULT false,
	`trashed` integer DEFAULT false,
	`content` text,
	`children` text,
	`props` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text DEFAULT '',
	`parentId` text DEFAULT '',
	`replyCount` integer DEFAULT 0 NOT NULL,
	`postId` text NOT NULL,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `database` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`parentId` text,
	`parentType` text,
	`activeViewId` text,
	`viewIds` text,
	`name` text,
	`color` text,
	`cover` text(2183) DEFAULT '',
	`icon` text,
	`trashed` integer DEFAULT false,
	`props` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `field` (
	`id` text PRIMARY KEY NOT NULL,
	`databaseId` text NOT NULL,
	`isPrimary` integer DEFAULT false,
	`name` text NOT NULL,
	`displayName` text,
	`description` text,
	`fieldType` text,
	`config` text,
	`options` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `label` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(50) DEFAULT '' NOT NULL,
	`color` text(50) DEFAULT '',
	`assetCount` integer DEFAULT 0,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `node` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`parentId` text,
	`databaseId` text,
	`type` text,
	`content` text,
	`props` text,
	`collapsed` integer DEFAULT false,
	`folded` integer DEFAULT true,
	`children` text,
	`date` text(20),
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`parentId` text,
	`parentType` text,
	`cover` text(2183) DEFAULT '',
	`icon` text,
	`trashed` integer DEFAULT false,
	`isJournal` integer DEFAULT false,
	`children` text,
	`props` text,
	`date` text(20),
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `post_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	`tagId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text(500) DEFAULT '',
	`description` text(1000) DEFAULT '',
	`content` text DEFAULT '' NOT NULL,
	`cid` text(100) DEFAULT '',
	`nodeId` text,
	`creationId` integer,
	`type` text DEFAULT 'ARTICLE',
	`gateType` text DEFAULT 'FREE',
	`postStatus` text DEFAULT 'DRAFT',
	`commentStatus` text DEFAULT 'OPEN',
	`commentCount` integer DEFAULT 0,
	`image` text(2183) DEFAULT '',
	`featured` integer DEFAULT false,
	`collectible` integer DEFAULT false,
	`publishedAt` integer,
	`archivedAt` integer,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `record` (
	`id` text PRIMARY KEY NOT NULL,
	`databaseId` text NOT NULL,
	`sort` integer DEFAULT 0,
	`fields` text,
	`deletedAt` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`description` text(500) DEFAULT '',
	`about` text DEFAULT '',
	`spaceId` text(50),
	`logo` text(2183) DEFAULT '',
	`font` text(50) DEFAULT 'font-cal',
	`image` text(2183) DEFAULT '',
	`email` text(255),
	`mode` text DEFAULT 'BASIC',
	`socials` text,
	`config` text,
	`themeName` text(50),
	`themeConfig` text,
	`memberCount` integer DEFAULT 0,
	`postCount` integer DEFAULT 0,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(50) DEFAULT '' NOT NULL,
	`color` text(50) DEFAULT '',
	`postCount` integer DEFAULT 0,
	`hidden` integer DEFAULT false,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'READER' NOT NULL,
	`name` text(255) DEFAULT '' NOT NULL,
	`displayName` text(255) DEFAULT '',
	`ensName` text(255),
	`email` text(255),
	`emailVerifiedAt` integer,
	`github` text,
	`google` text,
	`image` text(2183),
	`cover` text(2183),
	`bio` text(5000) DEFAULT '',
	`about` text DEFAULT '',
	`subscriptions` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `view` (
	`id` text PRIMARY KEY NOT NULL,
	`databaseId` text NOT NULL,
	`name` text,
	`description` text,
	`viewType` text,
	`viewFields` text,
	`sorts` text,
	`groups` text,
	`filters` text,
	`kanbanFieldId` text,
	`kanbanOptionIds` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `accessTokens_user_id_idx` ON `access_token` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_providerAccountId_unique` ON `account` (`providerAccountId`);--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `albums_name_idx` ON `album` (`name`);--> statement-breakpoint
CREATE INDEX `assetAlbums_asset_id_idx` ON `asset_album` (`assetId`);--> statement-breakpoint
CREATE INDEX `assetLabels_asset_id_idx` ON `asset_label` (`assetId`);--> statement-breakpoint
CREATE UNIQUE INDEX `asset_url_unique` ON `asset` (`url`);--> statement-breakpoint
CREATE INDEX `assets_user_id_idx` ON `asset` (`userId`);--> statement-breakpoint
CREATE INDEX `assets_content_type_idx` ON `asset` (`contentType`);--> statement-breakpoint
CREATE INDEX `blocks_page_id_idx` ON `block` (`pageId`);--> statement-breakpoint
CREATE INDEX `blocks_type_idx` ON `block` (`type`);--> statement-breakpoint
CREATE INDEX `blocks_trashed_idx` ON `block` (`trashed`);--> statement-breakpoint
CREATE INDEX `comments_user_id_idx` ON `comment` (`userId`);--> statement-breakpoint
CREATE INDEX `comments_post_id_idx` ON `comment` (`postId`);--> statement-breakpoint
CREATE INDEX `databases_user_id_idx` ON `database` (`userId`);--> statement-breakpoint
CREATE INDEX `fields_database_id_idx` ON `field` (`databaseId`);--> statement-breakpoint
CREATE INDEX `fields_field_type_idx` ON `field` (`fieldType`);--> statement-breakpoint
CREATE INDEX `labels_name_idx` ON `label` (`name`);--> statement-breakpoint
CREATE INDEX `nodes_user_id_idx` ON `node` (`userId`);--> statement-breakpoint
CREATE INDEX `nodes_type_idx` ON `node` (`type`);--> statement-breakpoint
CREATE INDEX `pages_user_id_idx` ON `page` (`userId`);--> statement-breakpoint
CREATE INDEX `pages_is_journal_idx` ON `page` (`isJournal`);--> statement-breakpoint
CREATE INDEX `postTags_post_id_idx` ON `post_tag` (`postId`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_slug_unique` ON `post` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_nodeId_unique` ON `post` (`nodeId`);--> statement-breakpoint
CREATE INDEX `posts_user_id_idx` ON `post` (`userId`);--> statement-breakpoint
CREATE INDEX `posts_type_idx` ON `post` (`type`);--> statement-breakpoint
CREATE INDEX `posts_gate_type_idx` ON `post` (`gateType`);--> statement-breakpoint
CREATE INDEX `posts_user_id_post_status` ON `post` (`userId`,`postStatus`);--> statement-breakpoint
CREATE INDEX `posts_user_id_type` ON `post` (`userId`,`type`);--> statement-breakpoint
CREATE INDEX `records_database_id_idx` ON `record` (`databaseId`);--> statement-breakpoint
CREATE UNIQUE INDEX `site_email_unique` ON `site` (`email`);--> statement-breakpoint
CREATE INDEX `tags_name_idx` ON `tag` (`name`);--> statement-breakpoint
CREATE INDEX `tags_hidden_idx` ON `tag` (`hidden`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `views_database_id_idx` ON `view` (`databaseId`);