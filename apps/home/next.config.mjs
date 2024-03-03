import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import './src/env.mjs'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '@penx/abi',
    '@penx/api',
    '@penx/app',
    '@penx/constants',
    '@penx/db',
    '@penx/math',
    '@penx/catalogue',
    '@penx/hooks',
    '@penx/local-db',
    '@penx/wagmi',
    '@penx/icons',
    '@penx/google-translate',
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
    '@penx/trpc-client',
    '@penx/sync',
    '@penx/sync-server-client',
    '@penx/unique-id',
    '@penx/extension-list',
    '@penx/worker',
    'uikit',
    '@penx/slate-lists',
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

    config.externals.push('pino-pretty', 'lokijs', 'encoding')

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

export default config
