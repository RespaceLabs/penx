// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  CommentStatus,
  GateType,
  PostStatus,
  PostType,
  SiteMode,
  UserRole,
} from '@/lib/types'
import { relations } from 'drizzle-orm'
import {
  index,
  int,
  integer,
  primaryKey,
  sqliteTable as table,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import * as t from 'drizzle-orm/sqlite-core'
import { v4 } from 'uuid'

export const sites = table('site', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text('name', { length: 100 }).notNull(),
  description: text('description', { length: 500 }).default(''),
  about: text('about').default(''),
  spaceId: text('spaceId', { length: 50 }),
  logo: text('logo', { length: 2183 }).default(''),
  font: text('font', { length: 50 }).default('font-cal'),
  image: text('image', { length: 2183 }).default(''),
  email: text('email', { length: 255 }).unique(),
  mode: text('mode').default(SiteMode.BASIC),
  socials: text('socials'),
  config: text('config'),
  themeName: text('themeName', { length: 50 }),
  themeConfig: text('themeConfig'),
  memberCount: integer('memberCount').default(0),
  postCount: integer('postCount').default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export const users = table('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => v4()),
  role: text('role').notNull().default(UserRole.READER),
  name: text('name', { length: 255 }).notNull().default(''),
  displayName: text('displayName', { length: 255 }).default(''),
  ensName: text('ensName', { length: 255 }),
  email: text('email', { length: 255 }).unique(),
  emailVerifiedAt: integer('emailVerifiedAt', { mode: 'timestamp' }),
  github: text('github'), // GitHub OAuth info
  google: text('google'), // Google OAuth info
  image: text('image', { length: 2183 }),
  cover: text('cover', { length: 2183 }),
  bio: text('bio', { length: 5000 }).default(''),
  about: text('about').default(''),
  subscriptions: text('subscriptions'),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
  comments: many(comments),
  tags: many(tags),
  accessTokens: many(accessTokens),
}))

export const accounts = table(
  'account',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    providerType: text('providerType', { length: 40 }),
    providerAccountId: text('providerAccountId', { length: 255 })
      .unique()
      .default(''),
    providerInfo: text('providerInfo'),
    email: text('email', { length: 255 }),
    accessToken: text('accessToken', { length: 255 }),
    refreshToken: text('refreshToken', { length: 255 }),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('account_user_id_idx').on(table.userId),
    }
  },
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [accounts.userId] }),
}))

export const nodes = table(
  'node',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    userId: text('userId').notNull(),
    parentId: text('parentId'),
    databaseId: text('databaseId'),
    type: text('type'),
    element: text('element'),
    props: text('props'),
    collapsed: integer('collapsed', { mode: 'boolean' }).default(false),
    folded: integer('folded', { mode: 'boolean' }).default(true),
    children: text('children'),
    date: text('date', { length: 20 }),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('nodes_user_id_idx').on(table.userId),
      typeIndex: t.index('nodes_type_idx').on(table.type),
    }
  },
)

export const nodesRelations = relations(nodes, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [nodes.userId] }),
}))

export const posts = table(
  'post',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    slug: text('slug')
      .unique()
      .notNull()
      .$defaultFn(() => v4()),
    title: text('title', { length: 500 }).default(''),
    description: text('description', { length: 1000 }).default(''),
    content: text('content').notNull().default(''),
    cid: text('cid', { length: 100 }).default(''),
    nodeId: text('nodeId').unique(),
    creationId: integer('creationId'),
    type: text('type').default(PostType.ARTICLE),
    gateType: text('gateType').default(GateType.FREE),
    postStatus: text('postStatus').default(PostStatus.DRAFT),
    commentStatus: text('commentStatus').default(CommentStatus.OPEN),
    commentCount: integer('commentCount').default(0),
    image: text('image', { length: 2183 }).default(''),
    featured: integer('featured', { mode: 'boolean' }).default(false),
    collectible: integer('collectible', { mode: 'boolean' }).default(false),
    publishedAt: integer('publishedAt', { mode: 'timestamp' }),
    archivedAt: integer('archivedAt', { mode: 'timestamp' }),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('posts_user_id_idx').on(table.userId),
      typeIndex: t.index('posts_type_idx').on(table.type),
      getTypeIndex: t.index('posts_gate_type_idx').on(table.gateType),
      userId_postStatus: t
        .index('posts_user_id_post_status')
        .on(table.userId, table.postStatus),
      userId_type: t.index('posts_user_id_type').on(table.userId, table.type),
    }
  },
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [posts.userId] }),
  comments: many(comments),
  postTags: many(postTags),
}))

export const comments = table(
  'comment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    content: text('content').default(''),
    parentId: text('parentId').default(''),
    replyCount: integer('replyCount').notNull().default(0),
    postId: text('postId').notNull(),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('comments_user_id_idx').on(table.userId),
      postIdIndex: t.index('comments_post_id_idx').on(table.postId),
    }
  },
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [comments.userId] }),
  post: one(posts, { references: [posts.id], fields: [comments.userId] }),
  parent: one(comments, {
    references: [comments.id],
    fields: [comments.parentId],
  }),
  // replies: many(comments),
}))

export const tags = table(
  'tag',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    name: text('name', { length: 50 }).notNull().default(''),
    color: text('color', { length: 50 }).default(''),
    postCount: integer('postCount').default(0),
    hidden: integer('hidden', { mode: 'boolean' }).default(false),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIndex: t.index('tags_name_idx').on(table.name),
      hiddenIndex: t.index('tags_hidden_idx').on(table.hidden),
    }
  },
)

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [tags.userId] }),
  postTags: many(postTags),
}))

export const postTags = table(
  'post_tag',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    postId: text('postId').notNull(),
    tagId: text('tagId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      postIdIndex: t.index('postTags_post_id_idx').on(table.postId),
    }
  },
)

export const postTagsRelations = relations(postTags, ({ one, many }) => ({
  post: one(posts, { references: [posts.id], fields: [postTags.postId] }),
  tag: one(tags, { references: [tags.id], fields: [postTags.postId] }),
}))

export const accessTokens = table(
  'access_token',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    token: text('token', { length: 255 }).default(''),
    alias: text('alias', { length: 50 }),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }),
    lastUsedAt: integer('lastUsedAt', { mode: 'timestamp' }),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },

  (table) => {
    return {
      userIdIndex: t.index('accessTokens_user_id_idx').on(table.userId),
    }
  },
)

export const accessTokensRelations = relations(
  accessTokens,
  ({ one, many }) => ({
    user: one(users, { references: [users.id], fields: [accessTokens.userId] }),
  }),
)

export type Site = typeof sites.$inferSelect
export type Post = typeof posts.$inferSelect
export type User = typeof users.$inferSelect
export type Account = typeof accounts.$inferSelect
export type Comment = typeof comments.$inferSelect
export type Tag = typeof tags.$inferSelect
export type PostTag = typeof postTags.$inferSelect
export type AccessToken = typeof accessTokens.$inferSelect
