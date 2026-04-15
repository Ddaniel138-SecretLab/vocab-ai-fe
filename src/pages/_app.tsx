import type { AppProps } from 'next/app';
import Head from 'next/head'; // Import thẻ Head của Next.js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme, { inter } from '@/theme';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>VOCAB AI - Học từ vựng thông minh cùng AI</title>
        <meta name="description" content="Quên đi cách học vẹt nhàm chán. Vocab AI tự động sinh ví dụ, ngữ cảnh và bài tập thực hành dựa trên sở thích cá nhân của riêng bạn." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="VOCAB AI - Học từ vựng thông minh cùng AI" />
        <meta property="og:description" content="Quên đi cách học vẹt nhàm chán. Vocab AI tự động sinh ví dụ, ngữ cảnh và bài tập thực hành dựa trên sở thích cá nhân của riêng bạn." />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VOCAB AI - Học từ vựng thông minh cùng AI" />
        <meta name="twitter:description" content="Quên đi cách học vẹt nhàm chán. Vocab AI tự động sinh ví dụ, ngữ cảnh và bài tập thực hành dựa trên sở thích cá nhân của riêng bạn." />
      </Head>

      <main className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </main>
    </>
  );
}