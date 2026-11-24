import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

/**
 * NextAuth configuration.
 *
 * Google OAuth is enabled ONLY when both GOOGLE_CLIENT_ID and
 * GOOGLE_CLIENT_SECRET are set in the environment. Otherwise the app falls
 * back to a client-side "Demo Google account picker" so the preview still
 * demonstrates the Google sign-in UX without real credentials.
 *
 * To enable real Google Sign-In:
 *   1. Uncomment GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env
 *   2. Set NEXTAUTH_URL to the public URL of your deployment
 *   3. Register the redirect URI <NEXTAUTH_URL>/api/auth/callback/google
 *      in Google Cloud Console → Credentials → OAuth client ID
 */
const hasGoogleCreds =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET

export const googleEnabled = hasGoogleCreds

export const authOptions: NextAuthOptions = {
  // Only register Google provider if real creds are present. Otherwise
  // /api/auth/providers will throw — keeping the route alive without a
  // provider lets us still serve /api/auth/csrf etc. for the demo picker.
  providers: hasGoogleCreds
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          authorization: {
            params: {
              prompt: "select_account",
              access_type: "offline",
              scope: "openid email profile",
            },
          },
        }),
      ]
    : [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    // Allow the cookie to be sent on the cross-origin preview domain
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // @ts-expect-error - profile sub-fields are not typed by next-auth
        token.picture = profile.picture ?? profile.image ?? token.picture
        // @ts-expect-error - profile sub-fields are not typed by next-auth
        token.name = profile.name ?? token.name
        // @ts-expect-error - profile sub-fields are not typed by next-auth
        token.email = profile.email ?? token.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name
        session.user.email = token.email ?? session.user.email
        // @ts-expect-error - picture is not on the default User type
        session.user.image = token.picture ?? session.user.image
      }
      return session
    },
  },
  pages: {
    // We don't ship custom sign-in pages — signIn("google") redirects to
    // Google directly. Demo flow uses our own modal.
    signIn: "/",
  },
}
