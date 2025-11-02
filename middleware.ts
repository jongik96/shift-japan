// Middleware disabled - using app/page.tsx redirect instead
// This avoids all Edge Runtime __dirname issues

export function middleware() {
  // Empty middleware - let app/page.tsx handle redirects
  return
}

export const config = {
  matcher: [], // Match nothing - middleware disabled
}

