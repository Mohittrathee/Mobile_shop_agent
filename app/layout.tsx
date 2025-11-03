import './globals.css'; 
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Shop AI Pro',
  description: 'AI-powered mobile shopping assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
