import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { FirebaseProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RentVerify | Secure House Rental Platform',
  description: 'Connect with verified landlords and tenants. Secure, fast, and transparent house rentals.',
  icons: {
    icon: '/1000130925-Photoroom.png',
    apple: '/1000130925-Photoroom.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
