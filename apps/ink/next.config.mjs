import NextPWA from 'next-pwa'
// Importing env files here to validate on build
// import runtimeCaching from 'next-pwa/cache'
import './src/env.mjs'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '@penx/abi',
    '@penx/math',
    '@penx/constants',
    '@penx/wagmi',
    '@penx/icons',
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

    return config
  },
}

export default config
