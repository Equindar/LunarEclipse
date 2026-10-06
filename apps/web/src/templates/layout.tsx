import { assetTags } from '../assets';

export const Base = ({ children }: { children?: any }) => {
  const { js, css } = assetTags()
  return (
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        {css.map(href => <link rel="stylesheet" href={href} />)}
        {js.map(src => <script type="module" src={src} />)}
      </head>
      <body class="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
