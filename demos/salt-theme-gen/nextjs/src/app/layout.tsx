import type { Metadata } from 'next';
import { buildCss, theme } from '@/lib/theme';

export const metadata: Metadata = { title: 'salt-theme-gen — Next.js' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const css = buildCss();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`,
          }}
        />
      </head>
      <body style={{ margin: 0, background: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
