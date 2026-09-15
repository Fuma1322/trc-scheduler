import type { Metadata } from 'next';
import Navbar from '@/components//layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileDock from '@/components/layout/MobileDock';

export const metadata: Metadata = {
  title: 'TRC Event Scheduler',
  description: 'Manage TRC hall bookings, events and availability.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F7F8F5] text-[#17201C] antialiased">
        <Navbar />

        <main className="min-h-screen">
            {children}
        </main>

        <div className="pb-24 md:pb-0">
            <Footer />
        </div>

        <MobileDock />
        </body>
    </html>
  );
}