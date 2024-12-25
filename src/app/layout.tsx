import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "git-christmas",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="396b7370-0a5c-4ba9-98a4-29255f721d38"
        ></script>
      </head>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          GeistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
