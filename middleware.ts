import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const langMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en"
});
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1]
  const isLoggedIn = Boolean(request.cookies.get("token"));
  if (pathname.match(/^\/(en|ar)\/(login|forgetPassword|changePassword)/)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale ? locale : 'en'}/landing-page`, request.url));
    }
    return langMiddleware(request);
  } else {
    if (isLoggedIn) {
      if (pathname=='/'||pathname=='/ar'||pathname=='/en'){
        return NextResponse.redirect(new URL(`/${locale ? locale : 'en'}/landing-page`, request.url));
      }
    else {
      return langMiddleware(request);
    }
  }
  return NextResponse.redirect(new URL(`/${locale ? locale : 'en'}/login`, request.url));
}}
export const config = {
  matcher: ["/", "/(en|ar)/:path*"]
};
