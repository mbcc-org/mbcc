/**
 * MBCC Locale Routing Worker
 *
 * Handles locale-based routing for the MBCC website.
 * Currently English-only (served from /), with /ms/ and /zh/ reserved for future locales.
 *
 * Logic:
 * 1. Check for language cookie (mbcc-lang)
 * 2. Parse Accept-Language header
 * 3. Fall back to English (default)
 * 4. Serve static assets from the appropriate locale directory
 */

interface Env {
  ASSETS: Fetcher;
}

const SUPPORTED_LOCALES = ["en", "ms", "zh"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "en";
const COOKIE_NAME = "mbcc-lang";

function getLocaleFromCookie(request: Request): Locale | null {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;

  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  const value = match[1] as Locale;
  return SUPPORTED_LOCALES.includes(value) ? value : null;
}

function getLocaleFromHeader(request: Request): Locale {
  const acceptLang = request.headers.get("Accept-Language");
  if (!acceptLang) return DEFAULT_LOCALE;

  // Parse Accept-Language: en-US,en;q=0.9,ms;q=0.8,zh;q=0.7
  const languages = acceptLang
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(),
        quality: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    if (SUPPORTED_LOCALES.includes(lang.code as Locale)) {
      return lang.code as Locale;
    }
  }

  return DEFAULT_LOCALE;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Static assets pass through directly
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|webp|avif)$/)) {
      return env.ASSETS.fetch(request);
    }

    // Check if the request already has a locale prefix
    const pathParts = url.pathname.split("/").filter(Boolean);
    const firstPart = pathParts[0] as Locale;

    if (firstPart && SUPPORTED_LOCALES.includes(firstPart) && firstPart !== DEFAULT_LOCALE) {
      // Locale prefix present (e.g., /ms/about) — serve directly
      // In the future, this will serve from locale-specific builds
      return env.ASSETS.fetch(request);
    }

    // For the default locale (English), serve from root — no redirect needed
    // Detect locale for potential future redirect when locales are available
    const cookieLocale = getLocaleFromCookie(request);
    const detectedLocale = cookieLocale || getLocaleFromHeader(request);

    // Currently: serve English from root regardless of detected locale
    // When additional locales ship, uncomment the redirect logic below:
    //
    // if (detectedLocale !== DEFAULT_LOCALE) {
    //   const redirectUrl = new URL(`/${detectedLocale}${url.pathname}`, url.origin);
    //   return Response.redirect(redirectUrl.toString(), 302);
    // }

    const response = await env.ASSETS.fetch(request);

    // Set Vary header so CDN caches per Accept-Language
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Vary", "Accept-Language");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
