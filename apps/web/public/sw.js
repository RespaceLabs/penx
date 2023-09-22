if (!self.define) {
  let e,
    s = {}
  const n = (n, a) => (
    (n = new URL(n + '.js', a).href),
    s[n] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = n), (e.onload = s), document.head.appendChild(e)
        } else (e = n), importScripts(n), s()
      }).then(() => {
        let e = s[n]
        if (!e) throw new Error(`Module ${n} didn’t register its module`)
        return e
      })
  )
  self.define = (a, t) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[c]) return
    let i = {}
    const r = (e) => n(e, c),
      f = { module: { uri: c }, exports: i, require: r }
    s[c] = Promise.all(a.map((e) => f[e] || r(e))).then((e) => (t(...e), i))
  }
}
define(['./workbox-8c8aeaed'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/328qXvOxbqLKw9pBubeSB/_buildManifest.js',
          revision: '8c3e4893f6495e8faeb0206bf1ed5d61',
        },
        {
          url: '/_next/static/328qXvOxbqLKw9pBubeSB/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/0e17799a-3c7a9937a7f79749.js',
          revision: '3c7a9937a7f79749',
        },
        {
          url: '/_next/static/chunks/144-4e3289410ec4b936.js',
          revision: '4e3289410ec4b936',
        },
        {
          url: '/_next/static/chunks/244.5a2bae0bea16766e.js',
          revision: '5a2bae0bea16766e',
        },
        {
          url: '/_next/static/chunks/344-d1f75c262950a6fc.js',
          revision: 'd1f75c262950a6fc',
        },
        {
          url: '/_next/static/chunks/608.43aefa054887d91d.js',
          revision: '43aefa054887d91d',
        },
        {
          url: '/_next/static/chunks/68.3aa23af49aff463b.js',
          revision: '3aa23af49aff463b',
        },
        {
          url: '/_next/static/chunks/70-833bb7e1842456f2.js',
          revision: '833bb7e1842456f2',
        },
        {
          url: '/_next/static/chunks/702-ef3488d39d7fc297.js',
          revision: 'ef3488d39d7fc297',
        },
        {
          url: '/_next/static/chunks/706.cb673cf1ebc07bac.js',
          revision: 'cb673cf1ebc07bac',
        },
        {
          url: '/_next/static/chunks/70e01b48-f60feef1c31bb7c2.js',
          revision: 'f60feef1c31bb7c2',
        },
        {
          url: '/_next/static/chunks/75627ae9-1cad35dd1da2e05e.js',
          revision: '1cad35dd1da2e05e',
        },
        {
          url: '/_next/static/chunks/806.b7a30485c068cb76.js',
          revision: 'b7a30485c068cb76',
        },
        {
          url: '/_next/static/chunks/818-f2ee231c9f3a9d54.js',
          revision: 'f2ee231c9f3a9d54',
        },
        {
          url: '/_next/static/chunks/88929249-3f7ebf0ee1e02955.js',
          revision: '3f7ebf0ee1e02955',
        },
        {
          url: '/_next/static/chunks/910.a0f2448b49e0f2b7.js',
          revision: 'a0f2448b49e0f2b7',
        },
        {
          url: '/_next/static/chunks/96.db3752229e3104bb.js',
          revision: 'db3752229e3104bb',
        },
        {
          url: '/_next/static/chunks/f69bbb46-ac03975a4c77db33.js',
          revision: 'ac03975a4c77db33',
        },
        {
          url: '/_next/static/chunks/framework-d5b249005e2ab443.js',
          revision: 'd5b249005e2ab443',
        },
        {
          url: '/_next/static/chunks/main-af2ff8dc80bf4691.js',
          revision: 'af2ff8dc80bf4691',
        },
        {
          url: '/_next/static/chunks/pages/404-d51591007c08208d.js',
          revision: 'd51591007c08208d',
        },
        {
          url: '/_next/static/chunks/pages/_app-9618d2e1c3b5f24e.js',
          revision: '9618d2e1c3b5f24e',
        },
        {
          url: '/_next/static/chunks/pages/_error-9806df44f7563c86.js',
          revision: '9806df44f7563c86',
        },
        {
          url: '/_next/static/chunks/pages/editor-91f8360a4d8482d4.js',
          revision: '91f8360a4d8482d4',
        },
        {
          url: '/_next/static/chunks/pages/index-3a1f45be249f2e60.js',
          revision: '3a1f45be249f2e60',
        },
        {
          url: '/_next/static/chunks/pages/login-77036520c8d1f7af.js',
          revision: '77036520c8d1f7af',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        {
          url: '/_next/static/chunks/webpack-a5fe4aa47e2a9f0b.js',
          revision: 'a5fe4aa47e2a9f0b',
        },
        {
          url: '/_next/static/css/b91e76e1e991b100.css',
          revision: 'b91e76e1e991b100',
        },
        {
          url: '/chart-example.png',
          revision: '01a5d212f9ff0e9350450c0f5c487012',
        },
        { url: '/favicon.ico', revision: '21b739d43fcb9bbb83d8541fe4fe88fa' },
        { url: '/logo.png', revision: 'a48f3a769a791c7a054849f8b1a3c309' },
        { url: '/vercel.svg', revision: '0277e415b4bba9361a057a607884c295' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: a,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    )
})
