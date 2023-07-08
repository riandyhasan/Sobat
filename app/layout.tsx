"use client";

import "./globals.css";
import { useEffect } from "react";
import { lightTheme } from "@themes/light";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Sidebar from "@components/Layout/Sidebar";
import Footer from "@components/Layout/Footer";
import { checkAuth } from "@services/auth";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const checkAuthenticate = async () => {
    try {
      await checkAuth();
      if (pathname === "/") router.push("/obat");
    } catch (error) {
      if (pathname !== "/") router.push("/");
    }
  };

  useEffect(() => {
    checkAuthenticate();
  }, []);

  return (
    <html lang="en">
      <title>Sobat</title>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <body>
          {pathname === "/" ? (
            children
          ) : (
            <>
              <Sidebar pathname={pathname}>{children}</Sidebar>
              <Footer />
            </>
          )}
        </body>
      </ThemeProvider>
    </html>
  );
}
