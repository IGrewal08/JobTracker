import { Links, Meta, Outlet, Scripts, type LinksFunction } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import './styles/Global.css';
import globalStylesUrl from './styles/Global.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStylesUrl },
];

export default function Root() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                  try {
                      var savedTheme = localStorage.getItem('theme');
                      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      var theme = savedTheme || (prefersDark ? 'dark' : 'light');
                      document.documentElement.setAttribute('data-theme', theme);
                  } catch (e) {}
              })();
            `,
          }}
        />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <link
          rel="icon"
          href="data:,"
        />
        <Links />
        <title>JobTracker.</title>
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
