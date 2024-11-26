import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "My App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <Head>
      </Head> */}
      <body>
        <div className="flex flex-col font-book">
          <div className="min-h-screen flex-grow flex flex-col py-12 px-20 bg-backdrop-primary">
            <main className="flex-grow container mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
