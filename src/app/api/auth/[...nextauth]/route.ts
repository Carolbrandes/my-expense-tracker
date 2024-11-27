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
                // Ensure user.id is a string before assignment
                token.userId = typeof user.id === 'string' ? user.id : '';
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.userId && session.user) {
                // Ensure token.userId is a string before assignment
                session.user.id = typeof token.userId === 'string' ? token.userId : '';
            }
            return session;
        },
    },
    secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };
