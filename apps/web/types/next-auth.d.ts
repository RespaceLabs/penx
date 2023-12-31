import { type DefaultSession, type NextAuthOptions } from 'next-auth'
import 'next-auth/jwt'
import 'next-auth'

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

// declare module 'next-auth/jwt' {
//   interface JWT {
//     /** The user's role. */
//     userRole?: 'admin'
//   }
// }

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    userId: string
    user: {
      id: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    name: string
    uid: string
    email: string
    sub: string
    iat: number
    exp: number
    jti: string
  }
}
