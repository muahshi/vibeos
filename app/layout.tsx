import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeOS — Your AI Identity Layer',
  description: 'AI-powered social platform that understands your vibe, connects you with your people, and evolves with you.',
  keywords: ['AI', 'personality', 'social', 'vibe', 'identity', 'mood tracking'],
  authors: [{ name: 'VibeOS' }],
  openGraph: {
    title: 'VibeOS — Your AI Identity Layer',
    description: 'Discover your vibe. Find your tribe.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeOS',
    description: 'Discover your vibe. Find your tribe.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text-primary antialiased">
        <div className="min-h-screen relative">
          {/* Global ambient background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-pink/5 rounded-full blur-[80px]" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
