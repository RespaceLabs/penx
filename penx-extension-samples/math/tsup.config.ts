import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'iife', 'esm'],
  treeshake: true,
  splitting: false,
  sourcemap: false,
  clean: true,
})
