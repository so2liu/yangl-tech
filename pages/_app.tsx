import { AppProps } from "next/app";
import { useState } from "react";

function App({ Component, pageProps }: AppProps) {
  const [lang, setLang] = useState<Language>('CN')

  return <Component {...pageProps} language={lang} />;
}

export default App;

export type Language = 'CN'|'DE'|'EN'