import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { camelCase, kebabCase } from 'case-anything'

export function withTheme(nextConfig = {}) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const themesDir = path.join(__dirname, 'themes')

  const dir = fs.readdirSync(themesDir).filter((f) => {
    const fullPath = path.join(themesDir, f)
    return fs.statSync(fullPath).isDirectory()
  })

  const themesText = `export const themes = [${dir.map((t) => '"' + t + '"').join(', ')}]`

  const importList = dir
    .map((t) => `import * as ${camelCase(t)} from './${t}';`)
    .join('\n')

  const mapText = `const map: Record<string, any> = {${dir.map((t) => `"${t}": ${camelCase(t)}`).join(', ')}}`

  return {
    ...nextConfig,
    webpack(config) {
      const themeFilePath = path.join(__dirname, 'themes', 'theme-loader.ts')
      const themeContent = `
${importList}
${themesText}
${mapText}

export function loadTheme(name = 'garden'): any {
  return map[name] || garden;
}
      `
      fs.writeFileSync(themeFilePath, themeContent.trim())
      return config
    },
  }
}
