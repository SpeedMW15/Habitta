import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Habitta | Encuentra tu hogar ideal",
  description: "Compra, venta y renta de propiedades en Morelos.",

  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },

  themeColor: "#1f2933",

  appleWebApp: {
    capable: true,
    title: "Habitta",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
