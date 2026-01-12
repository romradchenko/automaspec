import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    // all routes that require session should be here
    matcher: ['/dashboard', '/profile', '/create-organization', '/invitations']
}
