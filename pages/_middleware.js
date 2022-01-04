import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const { pathname } = req.nextUrl;

    // Allow the request if the following terms is true
    // 1. Its a request for next-auth session & provider fetching...
    // 2. The token exist

    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    // Else redirecting to Login Screen
    if (!token && !pathname.includes('/login')) {
        return NextResponse.redirect('/login')
    }
}

export default middleware
