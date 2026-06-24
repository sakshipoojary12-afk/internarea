import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

<Script
 src="https://checkout.razorpay.com/v1/checkout.js"
 strategy="lazyOnload"
/>

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
