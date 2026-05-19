import './globals.css';
import '@blind-chorus/ui/styles.css';
import localFont from 'next/font/local';
import { loadTokens, tokensAsCss } from '../lib/tokens';
import { asset } from '../lib/asset';
import { TokenChipCopy } from '../components/TokenChipCopy';

const pretendard = localFont({
  src: '../font/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});

export const metadata = {
  title: 'Chorus',
  description: 'Chorus — the design system behind our product.',
  icons: {
    icon: [
      { url: asset('/chorus_logo.svg'), media: '(prefers-color-scheme: light)' },
      { url: asset('/chorus_logo_dark.svg'), media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export default function RootLayout({ children }) {
  const css = tokensAsCss(loadTokens());
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <TokenChipCopy />
        {children}
      </body>
    </html>
  );
}
