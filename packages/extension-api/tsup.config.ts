import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  treeshake: true,
  splitting: true,
  sourcemap: true,
  clean: true,
})
