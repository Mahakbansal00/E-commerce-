import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const users = []

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Check if user exists
        let user = users.find(u => u.email === credentials.email)
        if (!user) {
          // Register new user
          user = {
            id: users.length + 1,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            password: credentials.password
          }
          users.push(user)
        }
        // Validate password
        if (user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email }
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/', // Use the home page for sign in
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
})
