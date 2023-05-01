import type { AppProps } from "next/app";

import "../styles/globals.css";
import { Header } from "@/components/Layout";
import { AuthProvider } from "@/lib/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
