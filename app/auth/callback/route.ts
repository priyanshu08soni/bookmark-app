import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        console.log('Exchange started for code:', code.substring(0, 10) + '...')
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            console.log('Exchange successful, redirecting to:', `${origin}${next}`)
            return NextResponse.redirect(`${origin}${next}`)
        }
        console.error('Exchange error:', error)
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
