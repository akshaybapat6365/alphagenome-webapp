import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AlphaGenome',
  description: 'Advanced AI-powered genetic analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="container-mx">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="text-2xl font-bold tracking-tighter text-white">AlphaGenome</Link>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/analyze" className="text-gray-400 link-hover">Analyze</Link>
                <Link href="/how-it-works" className="text-gray-400 link-hover">How It Works</Link>
                <Link href="/about" className="text-gray-400 link-hover">About</Link>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}