import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
    if (process.env.NEXT_PUBLIC_E2E_MOCK === 'true') {
        return NextResponse.next()
    }

    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard', '/profile', '/create-organization', '/invitations']
}
