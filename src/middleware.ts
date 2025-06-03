import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/settings(.*)'
]);

export default clerkMiddleware((auth, req) => {
  try {
    if (isProtectedRoute(req)) {
      if (!(auth as any).userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware 认证出错:', error);
    return NextResponse.json({ error: '认证过程中出现错误，请稍后再试' }, { status: 500 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};