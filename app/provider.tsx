'use client';

import { PosProvider } from '@/components/pos/context/PosContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PosProvider>{children}</PosProvider>;
}
