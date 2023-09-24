import { getAtomIds, getCssString } from '@fower/react'
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
          <style
            data-fower={getAtomIds()}
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
          <link rel="icon" href="/favicon.ico" />
          <script src="https://cdn.jsdelivr.net/npm/systemjs/dist/system.js"></script>
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
