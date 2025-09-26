import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
// @ts-ignore
import { Theme } from '@carbon/react'

export default function App({ Component, pageProps }: AppProps) {
  return <Theme theme="white"><Component {...pageProps} /></Theme>
}
