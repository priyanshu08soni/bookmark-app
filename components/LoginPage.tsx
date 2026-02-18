'use client'

import { signInWithGoogle } from '@/app/actions/auth'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background orbs */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }}
            />

            {/* Card */}
            <div
                className="glass animate-fade-in"
                style={{
                    maxWidth: '440px',
                    width: '100%',
                    borderRadius: '24px',
                    padding: '48px 40px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                    }}
                >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        marginBottom: '8px',
                        letterSpacing: '-0.5px',
                    }}
                    className="gradient-text"
                >
                    BookmarkVault
                </h1>

                <p
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: '15px',
                        marginBottom: '40px',
                        lineHeight: '1.6',
                    }}
                >
                    Your private, real-time bookmark manager.
                    <br />
                    Save links that matter, instantly.
                </p>

                {error && (
                    <div
                        style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            color: '#ef4444',
                            fontSize: '14px',
                        }}
                    >
                        Authentication failed. Please try again.
                    </div>
                )}

                <form action={signInWithGoogle}>
                    <button
                        type="submit"
                        id="google-signin-btn"
                        style={{
                            width: '100%',
                            padding: '14px 24px',
                            borderRadius: '14px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-card-hover)',
                            color: 'var(--text-primary)',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-card)'
                            e.currentTarget.style.borderColor = 'var(--accent)'
                            e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-card-hover)'
                            e.currentTarget.style.borderColor = 'var(--border)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        {/* Google Icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <p
                    style={{
                        marginTop: '32px',
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                        lineHeight: '1.6',
                    }}
                >
                    Your bookmarks are private and encrypted.
                    <br />
                    We never share your data.
                </p>

                {/* Feature pills */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        marginTop: '24px',
                        flexWrap: 'wrap',
                    }}
                >
                    {['🔒 Private', '⚡ Real-time', '🌐 Anywhere'].map((feat) => (
                        <span
                            key={feat}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '100px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '500',
                            }}
                        >
                            {feat}
                        </span>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    )
}
