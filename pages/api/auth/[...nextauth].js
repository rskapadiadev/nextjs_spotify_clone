import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotify, { SPOTIFY_LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
    try {
        spotify.setAccessToken(token.accessToken);
        spotify.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotify.refreshAccessToken();
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
        }
    } catch (error) {
        console.error(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}
export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: SPOTIFY_LOGIN_URL,
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }) {
            //    Initial Login
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,

                }
            }

            // If Access Token is not expires
            if (Date.now() < token.accessTokenExpires) {
                console.log('EXISTING ACCESS TOKEN IS VALID')
                return token;
            }

            // If Access Token is expires so we need to refresh it
            console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...');
            return await refreshAccessToken(token)

        },
        async session({session, token}) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session;

        }
    }
})

