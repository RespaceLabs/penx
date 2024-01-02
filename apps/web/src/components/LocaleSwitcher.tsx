import { useState } from 'react'
import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import {
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr'

export function LocaleSwitcher() {
  const router = useRouter()

  const languages: { [key: string]: string } = {
    en: `English`,
    ja: `日本語`,
    ko: `한국어`,
    fr: `Français`,
  }

  const [locale, setLocale] = useState<LOCALES>(
    router.locale!.split('-')[0] as LOCALES,
  )

  // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
  // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  //   languages['pseudo'] = t`Pseudo`
  // }

  function handleChange(locale: LOCALES) {
    setLocale(locale)
    router.push(router.pathname, router.pathname, { locale })
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Box bgGray100 py-10 px4 roundedXL cursorPointer>
          {languages[locale]}
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <Menu>
          {Object.keys(languages).map((locale) => {
            return (
              <PopoverClose asChild key={locale}>
                <MenuItem
                  onClick={() => {
                    handleChange(locale as any)
                  }}
                >
                  {/* {i18n._(languages[locale as unknown as LOCALES])} */}
                </MenuItem>
              </PopoverClose>
            )
          })}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
