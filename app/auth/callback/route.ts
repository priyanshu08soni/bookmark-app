import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    // Get the actual public origin from headers instead of internal request.url
    const host = request.headers.get('host') ?? 'bookmark-app-liard.vercel.app'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    if (code) {
        console.log('Exchanging code for session...')
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log('Session established, redirecting to:', next)
            return NextResponse.redirect(`${origin}${next}`)
        }

        console.error('Code exchange failed:', error.message)
    }

    // If something went wrong, send back to home or error page
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
