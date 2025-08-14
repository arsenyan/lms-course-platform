import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/search(.*)",
  "/api(.*)",
  "/consent",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/_next(.*)",
  "/favicon.ico",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();

  // If navigating to sign-up, ensure pre-signup consent cookie exists; otherwise redirect to consent page
  if (req.nextUrl.pathname.startsWith("/sign-up")) {
    const hasConsentCookie = req.cookies.get("pre_signup_consent")?.value === "1";
    if (!hasConsentCookie) {
      const url = new URL("/consent", req.url);
      return NextResponse.redirect(url);
    }
    return;
  }

  // Always allow public routes except sign-up which is handled above
  if (isPublicRoute(req)) return;

  // Require auth for private routes
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Enforce consent for all authenticated users before accessing the app
  const consentGiven = Boolean((sessionClaims as any)?.publicMetadata?.democraticConsent);
  if (!consentGiven && req.nextUrl.pathname !== "/consent") {
    const url = new URL("/consent", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
