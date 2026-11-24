import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// App Router route handler for NextAuth v4
// GET  /api/auth/csrf, /api/auth/signin, /api/auth/callback/:providerId,
//      /api/auth/signout, /api/auth/session, /api/auth/providers
const handler = NextAuth(authOptions)

export {
  handler as GET,
  handler as POST,
}
