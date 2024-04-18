import { useEffect } from 'react'

export function useHideLogoLoader() {
  useEffect(() => {
    const $el = document.getElementById('logo-loader-wrapper')
    if ($el) $el.style.display = 'none'
  }, [])
}
