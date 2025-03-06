import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import NavBar from "@/components/NavBar";
import { Providers } from "@/lib/Provider/Providers";
import LoaderScreen from "@/components/Loader/LoaderScreen";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased h-screen w-full `}
      >
        <Providers>
          <NavBar />

          <LoaderScreen/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
