import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from '@/components/Providers/AuthProvider';
import QueryProvider from '@/components/Providers/QueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "ServiceHub - Your One-Stop Service Platform",
    template: "%s | ServiceHub"
  },
  description: "Connect with trusted professionals for home repair, beauty services, grocery delivery, and pet care across India. Book instantly, pay securely, get quality service.",
  keywords: [
    "home services",
    "home repair", 
    "beauty services",
    "salon at home",
    "grocery delivery",
    "pet care",
    "handyman services",
    "service booking",
    "India services",
    "ServiceHub"
  ],
  authors: [{ name: "ServiceHub Team", url: "https://servicehub.com" }],
  creator: "ServiceHub",
  publisher: "ServiceHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://servicehub.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://servicehub.com",
    siteName: "ServiceHub",
    title: "ServiceHub - Your One-Stop Service Platform",
    description: "Connect with trusted professionals for all your service needs in India. Home repair, beauty, grocery delivery & pet care.",
    images: [
      {
        url: "https://servicehub.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ServiceHub - Trusted Service Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiceHub - Your One-Stop Service Platform",
    description: "Connect with trusted professionals for all your service needs in India.",
    images: ["https://servicehub.com/twitter-image.jpg"],
    creator: "@servicehub_in",
  },
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    "msapplication-TileColor": "#1EC6D9",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1EC6D9" },
    { media: "(prefers-color-scheme: dark)", color: "#1EC6D9" }
  ],
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ServiceHub",
  "description": "Connect with trusted professionals for home repair, beauty services, grocery delivery, and pet care across India.",
  "url": "https://servicehub.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "category": "Service",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  },
  "creator": {
    "@type": "Organization",
    "name": "ServiceHub"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        
        {/* PWA Meta Tags - Only in production */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <meta name="application-name" content="ServiceHub" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="ServiceHub" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="msapplication-tap-highlight" content="no" />
            <link rel="manifest" href="/manifest.json" />
          </>
        )}
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </QueryProvider>
        <Toaster 
          richColors 
          closeButton
          duration={4000}
          theme="light"
          position="top-right"
        />
      </body>
    </html>
  );
}