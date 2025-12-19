import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extended types for NextAuth
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  image: string;
  token: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface ExtendedToken {
  accessToken?: string;
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface ExtendedSession {
  user: {
    id?: string;
    accessToken?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * NextAuth configuration for DummyJSON authentication
 * This handles the login flow and session management
 */
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error('Auth API error:', data);
            return null;
          }

          return {
            id: data.id.toString(),
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            image: data.image,
            token: data.accessToken || data.token, // API returns accessToken
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        const extendedToken = token as ExtendedToken;
        extendedToken.accessToken = extendedUser.token;
        extendedToken.id = user.id;
        extendedToken.username = extendedUser.username;
        extendedToken.firstName = extendedUser.firstName;
        extendedToken.lastName = extendedUser.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const extendedToken = token as ExtendedToken;
        const extendedSession = session as ExtendedSession;
        extendedSession.user.id = extendedToken.id;
        extendedSession.user.accessToken = extendedToken.accessToken;
        extendedSession.user.username = extendedToken.username;
        extendedSession.user.firstName = extendedToken.firstName;
        extendedSession.user.lastName = extendedToken.lastName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

