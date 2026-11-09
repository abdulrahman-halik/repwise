import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
  publicRoutes: ['/', '/trainers', '/programs', '/messages', '/call', '/library', '/dashboard'],
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

