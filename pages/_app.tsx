import Navbar from "@/components/Navbar";
import Pagetrans from "@/components/Pagetrans";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import Footer from "@/components/Footer";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Pagetrans />

      <Component {...pageProps} />

    </Provider>
  );
}
