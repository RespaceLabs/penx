import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import million from 'million/compiler'
import NextPWA from 'next-pwa'
// Importing env files here to validate on build
// import runtimeCaching from 'next-pwa/cache'
import './src/env.mjs'

const isDev = process.env.NODE_ENV === 'development'

const withPWA = NextPWA({
  dest: 'public',
  // runtimeCaching,
  disableDevLogs: true,
})

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '@penx/api',
    '@penx/app',
    '@penx/constants',
    '@penx/db',
    '@penx/hooks',
    '@penx/local-db',
    '@penx/editor',
    '@penx/editor-queries',
    '@penx/editor-shared',
    '@penx/editor-transforms',
    '@penx/editor-types',
    '@penx/editor-common',
    '@penx/editor-composition',
    '@penx/icons',
    '@penx/shared',
    '@penx/model',
    '@penx/context-menu',
    '@penx/service',
    '@penx/serializer',
    '@penx/store',
    '@penx/session',
    '@penx/model-types',
    '@penx/cmdk',
    '@penx/indexeddb',
    '@penx/event',
    '@penx/storage-estimate',
    '@penx/word-count',
    '@penx/blockquote',
    '@penx/divider',
    '@penx/check-list',
    '@penx/auto-format',
    '@penx/paragraph',
    '@penx/list',
    '@penx/image',
    '@penx/file',
    '@penx/link',
    '@penx/bidirectional-link',
    '@penx/table',
    '@penx/database',
    '@penx/dnd-projection',
    '@penx/block-selector',
    '@penx/editor-leaf',
    '@penx/trpc-client',
    '@penx/sync',
    '@penx/unique-id',
    '@penx/extension-list',
    '@penx/worker',
    'uikit',
    'slate-lists',
  ],
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'ja', 'ko', 'fr', 'pseudo'],
    defaultLocale: 'en',
  },
  webpack: (config, { isServer }) => {
    // https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

// export default withPWA(million.next(config))
export default isDev ? config : withPWA(config)
