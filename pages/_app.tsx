import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import Header from "../components/header";
import { SpeedInsights } from '@vercel/speed-insights/next'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Analytics /> {/* ✅ 여기 */}
      <SpeedInsights /> {/* 👈 여기에 추가 */}
    </>
  );
}
