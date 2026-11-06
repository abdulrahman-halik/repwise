import type { Metadata } from 'next';
import { Barlow_Condensed, Caveat, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { themeInitScript } from '@/lib/theme-script';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const barlow = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-barlow' });
const caveat = Caveat({ subsets: ['latin'], weight: ['700'], variable: '--font-caveat' });

export const metadata: Metadata = {
  title: { default: 'Repwise — Train with coaches who get results', template: '%s · Repwise' },
  description:
    'Find a personal trainer, buy video workout programs and book live 1:1 sessions. Strength, HIIT, yoga, mobility and more.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('dark', inter.variable, barlow.variable, caveat.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
