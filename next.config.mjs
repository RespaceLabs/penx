import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import { withTheme } from './withTheme.mjs'

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-tweet'],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      { hostname: 'public.blob.vercel-storage.com' },
      { hostname: '2cil7amusloluyl8.public.blob.vercel-storage.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
      { hostname: '*.spaceprotocol.xyz' },
      { hostname: '*.penx.io' },
      { hostname: 'penx.io' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'abs.twimg.com' },
      { hostname: 'pbs.twimg.com' },
      { hostname: 'avatar.vercel.sh' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'www.google.com' },
      { hostname: 'flag.vercel.app' },
    ],
  },

  webpack: (config, { isServer }) => {
    // https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }

    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'bcrypt')

    return config
  },
}

export default withTheme(nextConfig)
