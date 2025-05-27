import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from '@/components/Providers/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceHub - Your One-Stop Service Platform",
  description: "Connect with trusted professionals for home repair, beauty services, grocery delivery, and pet care in India.",
  keywords: "services, home repair, beauty, grocery delivery, pet care, India, ServiceHub",
  authors: [{ name: "ServiceHub Team" }],
  creator: "ServiceHub",
  publisher: "ServiceHub",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://servicehub.com",
    siteName: "ServiceHub",
    title: "ServiceHub - Your One-Stop Service Platform",
    description: "Connect with trusted professionals for all your service needs in India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiceHub - Your One-Stop Service Platform",
    description: "Connect with trusted professionals for all your service needs in India.",
  },
};

// ✅ Moved viewport to its own export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1EC6D9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
        <Toaster 
          richColors 
          closeButton
          duration={4000}
          theme="light"
        />
      </body>
    </html>
  );
}
