import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import million from 'million/compiler'
// Importing env files here to validate on build
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
    '@penx/node-hooks',
    '@penx/local-db',
    '@penx/wagmi',
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
    '@penx/trpc-client',
    '@penx/unique-id',
    '@penx/widget',
    'uikit',
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
