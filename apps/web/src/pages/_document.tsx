import { Box, getAtomIds, getCssString } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    const cookieTheme = getCookie('theme-mode', ctx) as string

    if (!cookieTheme) {
      setCookie('theme-mode', 'light', { req: ctx.req, res: ctx.res })
    }

    let theme: string = getCookie('theme-mode', ctx) as string

    ;(initialProps as any).theme = theme

    return initialProps
  }
  render() {
    const theme = (this.props as any).theme

    return (
      <Html lang="en" className={theme || 'light'}>
        <Head>
          <meta name="application-name" content="PWA App" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="PWA App" />
          <meta name="description" content="Best PWA App in the world" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/images/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#fff" />

          <link rel="apple-touch-icon" href="/images/touch-icon-iphone.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/images/apple-touch-icon.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/apple-touch-icon.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/images/apple-touch-icon.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="mask-icon"
            href="/images/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Poppins"
            // href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          <style
            data-fower={getAtomIds()}
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
