import './globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Providers from './provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthContext';
import { InventoryProvider } from '@/components/pos/context/InventoryContext';
import AuthGuard from '@/components/auth/AdminGuard';
import { TableProvider } from '@/components/pos/context/TableContext';

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
  title: 'Steward',
  description: 'Proudly By MPLUG PTY LTD',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, poppins.variable)}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <AuthProvider>
          <AuthGuard>
            <TableProvider>
              <InventoryProvider>
                <Providers>
                  <Toaster position="top-right" richColors />
                  {children}
                </Providers>
              </InventoryProvider>
            </TableProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
