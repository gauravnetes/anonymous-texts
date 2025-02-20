import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"



// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    // redirection logic
    if (token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )) {
        return NextResponse.redirect(new URL('/dashboard', request.url)); // Already logged in, go to dashboard
    }
    
    if (!token && (url.pathname.startsWith('/dashboard'))) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    return NextResponse.next(); // Allow non-authenticated users to access sign-in and sign-up
}

// first tried this logic which was wrong

// if (token && (
//     url.pathname.startsWith('/sign-in') ||
//     url.pathname.startsWith('/sign-up') ||
//     url.pathname.startsWith('/verify') ||
//     url.pathname.startsWith('/')
// )) {
//     // we've token and we're going to the sign-in page which is not required. 
//     // we'll redirect to the dashboard
//     return NextResponse.redirect((new URL ('/dashboard', request.url)))
// }
// return NextResponse.redirect(new URL('/home', request.url))


// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in', 
        '/sign-up', 
        '/', 
        '/dashboard/:path*',    // all paths of dashboard/ included
        '/verify/:path*'        // all paths of dashboard/ included
    ],
}