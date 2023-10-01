import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import NextPWA from 'next-pwa'
// const withPWA = require('next-pwa')({
//   dest: 'public'
// })

// const withPWA = NextPWA({
//   dest: 'public'
// })

// Importing env files here to validate on build
import './src/env.mjs'

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    '@penx/api',
    '@penx/app',
    '@penx/constants',
    '@penx/db',
    '@penx/hooks',
    '@penx/local-db',
    '@penx/catalogue',
    '@penx/editor',
    '@penx/editor-queries',
    '@penx/editor-shared',
    '@penx/editor-transforms',
    '@penx/editor-types',
    '@penx/icons',
    '@penx/shared',
    '@penx/serializer',
    '@penx/store',
    '@penx/cmdk',
    '@penx/indexeddb',
    '@penx/event',
    '@penx/storage-estimate',
    '@penx/word-count',
    '@penx/blockquote',
    '@penx/divider',
    '@penx/check-list',
    '@penx/auto-format',
    '@penx/auto-node-id',
    '@penx/paragraph',
    '@penx/list',
    '@penx/image',
    '@penx/link',
    '@penx/internal-link',
    '@penx/table',
    '@penx/block-selector',
    'uikit',
    'slate-lists',
    'easy-modal',
  ],
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'ja', 'ko', 'fr', 'pseudo'],
    defaultLocale: 'en',
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
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
// export default withPWA(config)
export default config
