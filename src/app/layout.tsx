import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Langchain Toy',
  description: 'Langchain Toy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="p-4 vorder-b bg-white sticky top-0 z-10 shadow-sm">
          <nav className="max-w-4xl mx-auto flex gap-6 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Langchain Toy
            </Link>
            <Link href="/chat" className="hover:text-gray-900">
              Chat
            </Link>
            <Link href="/upload" className="hover:text-gray-900">
              Upload
            </Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
