import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoute = createRouteMatcher(['/create(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);


export default clerkMiddleware(async (auth, req) => {


  // if (protectedRoute(req)) {
  //   const aut = await auth();
  //   if (!aut.userId) {
  //     return aut.redirectToSignIn(new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL).toString());
  //   }
  // }

  if (isAdminRoute(req) && ((await auth()).sessionClaims?.metadata?.role !== 'admin')) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
    
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

