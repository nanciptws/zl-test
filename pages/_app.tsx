import '@assets/main.css'
import '@assets/header.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import NextProgress from "next-progress";

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {

  const Layout = (Component as any).Layout || Noop
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <>
      <Head />
      <ManagedUIContext>
        <NextProgress 
          color="#88b940"
          delay={300} 
          height={3}
          options={{ showSpinner: false }} />
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}
