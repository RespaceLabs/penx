const path = require('path')

module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@penx/db',
    '@penx/app',
    '@penx/hooks',
    '@penx/constants',
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
    'uikit',
    'slate-lists',
    'easy-modal',
  ],
}
