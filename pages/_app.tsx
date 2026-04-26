import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@/context/ThemeContext';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <title>Varun Kumar Bejugam | AI/ML Engineer</title>
        <meta name="description" content="Software Engineer and AI/ML researcher at Goldman Sachs. Building intelligent systems at the intersection of AI and finance." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://bejugamvarun.github.io" />
        <meta property="og:site_name" content="Varun Kumar Bejugam" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@bejugamvarun" />
        <meta name="twitter:creator" content="@bejugamvarun" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DV5LRNT5KK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DV5LRNT5KK');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1655204887552510"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
