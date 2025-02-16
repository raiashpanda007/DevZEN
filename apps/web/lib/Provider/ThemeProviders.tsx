"use client"
import { ThemeProvider } from "next-themes";
 const ThemeProviders = ({ children }:{children:React.ReactNode}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}> 
      {children}
    </ThemeProvider>
  );
}
export default ThemeProviders;