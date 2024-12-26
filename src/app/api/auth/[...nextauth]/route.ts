import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export const handler = NextAuth({
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = typeof user.id === 'string' ? user.id : '';
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.userId && session.user) {
                session.user.id = typeof token.userId === 'string' ? token.userId : '';
            }
            return session;
        },
    },
    secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };
