"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { store } from "../../store/store";
import { Provider } from "react-redux";
import ThemeProvider from "./ThemeProviders";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider> 
        </SessionProvider>
      </NextThemesProvider>
    </Provider>
  );
}
