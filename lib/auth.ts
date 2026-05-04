import { NextAuthOptions, DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: string
      credits: number
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
    credits: number
  }
}

const providers: NextAuthOptions['providers'] = []

if (process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

providers.push(
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() },
      })

      if (!user?.password) return null

      const valid = await compare(credentials.password, user.password)
      if (!valid) return null

      return {
        id: user.id,
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        image: user.image ?? undefined,
        plan: user.plan,
        credits: user.credits,
      }
    },
  })
)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
        token.id = user.id
        token.plan = (user as { plan?: string }).plan ?? 'free'
        token.credits = (user as { credits?: number }).credits ?? 0
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name
        token.picture = session.user.image
        if (session.user.plan) token.plan = session.user.plan as string
        if (session.user.credits != null) token.credits = session.user.credits as number
      }
      if (token.id) {
        const db = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, credits: true, name: true, image: true },
        })
        if (db) {
          token.plan = db.plan
          token.credits = db.credits
          token.name = db.name
          token.picture = db.image
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const uid = (token.sub ?? token.id) as string | undefined
        if (uid) session.user.id = uid
        session.user.plan = (token.plan as string) ?? 'free'
        session.user.credits = (token.credits as number) ?? 0
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      })
    },
  },
}
