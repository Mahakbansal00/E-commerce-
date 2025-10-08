import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const users = []

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user = users.find(u => u.email === credentials.email)
        if (!user) {
          user = {
            id: users.length + 1,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            password: credentials.password
          }
          users.push(user)
        }

        if (user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email }
        }

        return null
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET, // ADD THIS LINE
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      return session
    }
  }
}

export default NextAuth(authOptions)