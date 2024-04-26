import { Box, getAtomIds, getCssString } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'
import { NextSeo } from 'next-seo'
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
          <style
            data-fower={getAtomIds()}
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
          <link rel="icon" href="/favicon.ico" />

          {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <script
              defer
              src="https://umami.penx.io/script.js"
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID!}
            ></script>
          )}

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=optional"
          />
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
