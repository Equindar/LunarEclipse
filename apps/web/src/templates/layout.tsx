
import type { PropsWithChildren } from 'hono/jsx';
import { assetTags, DATASTAR_SRC } from '../utils/assetTags.js';

type LayoutProps = PropsWithChildren<{
  title?: string;
}>;

const themeScript = `
  (() => {
    const STORAGE_KEY = 'theme';
    const storedTheme = localStorage.getItem(STORAGE_KEY);

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const theme = storedTheme ?? (prefersDark ? 'dark' : 'light');

    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    );
  })();
`;

export const Layout = ({
  title = 'Web',
  children
}: LayoutProps) => {
  const { js, css } = assetTags();

  return (
    <html lang="de" data-theme="classic">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <title>{title}</title>
        <script type="module" src={DATASTAR_SRC}></script>

        {css.map(href => (
          <link rel="stylesheet" href={href} />
        ))}
        {js.map(src => (
          <script type="module" src={src}></script>
        ))}
      </head>

      <body class="min-h-screen">
        <main id="app" class="p-5">
          {children}
        </main>
      </body>
    </html>
  );
};
