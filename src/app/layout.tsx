import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grid & Circles",
  description: "Coffee Order Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>

      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}