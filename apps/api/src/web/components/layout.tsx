import type { PropsWithChildren } from 'hono/jsx'
import { raw } from 'hono/html'

const DATASTAR_SRC =
  'https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.3/bundles/datastar.js'

type LayoutProps = PropsWithChildren<{
  title?: string
}>

export const Layout = ({ title = 'App', children }: LayoutProps) => (
  <>
    {raw('<!DOCTYPE html>')}
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <script type="module" src={DATASTAR_SRC}></script>
      </head>
      <body>
        <main id="app">{children}</main>
      </body>
    </html>
  </>
)
