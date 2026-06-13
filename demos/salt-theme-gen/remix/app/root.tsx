import {
  Links, Meta, Outlet, Scripts, ScrollRestoration,
} from '@remix-run/react';
import { buildCss } from '~/lib/theme';

export function Layout({ children }: { children: React.ReactNode }) {
  const css = buildCss();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`,
          }}
        />
      </head>
      <body style={{ margin: 0, background: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'system-ui, sans-serif' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
