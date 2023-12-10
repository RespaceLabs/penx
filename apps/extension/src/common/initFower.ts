import { composeAtom, setConfig, setTheme } from '@fower/react'

export function initFower() {
  composeAtom('heading1', {
    text3XL: true,
    fontSemibold: true,
    mb: 20,
  })

  composeAtom('heading2', {
    textXL: true,
    fontSemibold: true,
    mb: 8,
  })

  setConfig({
    inline: true,
    mode: {
      currentMode: 'light',
      autoDarkMode: {
        enabled: false,
        mappings: {
          black: 'gray100',
          bgWhite: 'gray900',
          bgSlate100: 'gray900',
          brand500: 'brand500',
        },
      },
    },
  })

  setTheme({
    colors: {
      brand50: '#eef2ff',
      brand100: '#e0e7ff',
      brand200: '#c7d2fe',
      brand300: '#a5b4fc',
      brand400: '#818cf8',
      brand500: '#6B37FF',
      brand600: '#4f46e5',
      brand700: '#4338ca',
      brand800: '#5b21b6',
      brand900: '#4c1d95',
    },
    shadows: {
      popover:
        '0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)',
    },
  })
}
