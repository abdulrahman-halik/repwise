import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Repwise Habit Tracker - Simple Daily Consistency',
  description: 'A minimalist, client-side daily habit tracker with streaks and weekly progress.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-gray-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}

