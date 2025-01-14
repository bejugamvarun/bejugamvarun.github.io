import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/context/ThemeContext';
import SEO from '@/next-seo.config';
import { DefaultSeo } from 'next-seo';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
        <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
