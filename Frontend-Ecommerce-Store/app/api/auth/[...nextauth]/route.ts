import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Invalid credentials')

          return {
            id: data._id,
            email: data.email,
            name: data.name,
            isAdmin: data.isAdmin,
            backendToken: data.token, // ← store token here
            isSeller: data.isSeller,           // ← ADD THIS
            sellerStatus: data.sellerStatus,
          }
        } catch (error: any) {
          throw new Error(error.message || 'Login failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = (user as any).isAdmin
        token.isSeller = (user as any).isSeller        // ← add this
        token.sellerStatus = (user as any).sellerStatus 
        token.backendToken = (user as any).backendToken // ← save to JWT
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).isAdmin = token.isAdmin
        ;(session.user as any).isSeller = token.isSeller        // ← add this
        ;(session.user as any).sellerStatus = token.sellerStatus
        ;(session.user as any).backendToken = token.backendToken // ← expose in session
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }