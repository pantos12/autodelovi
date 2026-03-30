import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoDelovi.sale â PronaÄi auto delove u Srbiji",
  description: "PretraÅ¾i 18+ prodavnica auto delova u Srbiji. Poredi cene, proveri zalihe, rezerviÅ¡i kod majstora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body style={{minHeight:'100vh',margin:0}}>
        {children}
      </body>
    </html>
  );
}
