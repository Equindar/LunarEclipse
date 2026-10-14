import type { PropsWithChildren } from 'hono/jsx';
import { assetTags, DATASTAR_SRC } from '../utils/assetTags.js';

type LayoutProps = PropsWithChildren<{
  title?: string
}>

export const Layout = ({ title = 'Web', children }: LayoutProps) =>  {
  const { js, css } = assetTags()
  return (
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <title>{title}</title>
        <script type="module" src={DATASTAR_SRC}></script>
        {css.map(href => <link rel="stylesheet" href={href} />)}
        {js.map(src => <script type="module" src={src}></script>)}
      </head>
      <body class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-amber-50">
        <main id="app">
          {children}
        </main>
      </body>
    </html>
  )
}
