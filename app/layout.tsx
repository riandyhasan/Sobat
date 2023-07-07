"use client";

import "./globals.css";
import { lightTheme } from "@themes/light";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Sidebar from "@components/Layout/Sidebar";
import Footer from "@components/Layout/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <title>Sobat</title>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <body>
          <Sidebar pathname={pathname}>{children}</Sidebar>
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
