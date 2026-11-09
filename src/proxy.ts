import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
  publicRoutes: [
    '/',
    '/trainers',
    '/programs',
    '/messages',
    '/call',
    '/library',
    '/dashboard',
    '/auth/sign-in',
    '/auth/sign-up',
    '/monitoring',
  ],
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|monitoring|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
};


