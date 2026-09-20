import './globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TRC-SCHEDULER',
  description: 'Proudly Powered By MPLUG PTY LTD',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, poppins.variable)}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
