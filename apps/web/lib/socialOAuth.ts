export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

export type SocialProvider = "google" | "facebook";

export function getRedirectUri(pathname: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}${pathname}`;
}

export function buildOAuthUrl(provider: SocialProvider, redirectUri: string): string {
  if (provider === "google") {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error("Google login is not configured");
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&state=google`;
  }

  if (!FACEBOOK_APP_ID) {
    throw new Error("Facebook login is not configured");
  }

  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=email&state=facebook`;
}
