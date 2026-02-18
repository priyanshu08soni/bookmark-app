'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AddBookmarkFormProps {
    userId: string
    onBookmarkAdded?: (bookmark: any) => void
}

function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

export default function AddBookmarkForm({ userId, onBookmarkAdded }: AddBookmarkFormProps) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        const trimmedUrl = url.trim()
        const trimmedTitle = title.trim()

        if (!trimmedUrl) {
            setError('Please enter a URL.')
            return
        }

        // Auto-add https:// if missing
        const finalUrl = trimmedUrl.startsWith('http')
            ? trimmedUrl
            : `https://${trimmedUrl}`

        if (!isValidUrl(finalUrl)) {
            setError('Please enter a valid URL (e.g. https://example.com).')
            return
        }

        if (!trimmedTitle) {
            setError('Please enter a title for this bookmark.')
            return
        }

        setLoading(true)

        const { data, error: insertError } = await supabase
            .from('bookmarks')
            .insert({
                user_id: userId,
                url: finalUrl,
                title: trimmedTitle,
            })
            .select()
            .single()

        setLoading(false)

        if (insertError) {
            console.error('Insert Error Detail:', insertError.message, insertError.details, insertError.hint)
            setError(insertError.message || 'Failed to save bookmark. Please try again.')
            return
        }

        if (data && onBookmarkAdded) {
            onBookmarkAdded(data)
        }

        setUrl('')
        setTitle('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
    }

    return (
        <div
            className="glass"
            style={{
                borderRadius: '20px',
                padding: '28px',
            }}
        >
            <h2
                style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <span
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </span>
                Add New Bookmark
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {/* URL Input */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label
                            htmlFor="bookmark-url"
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                        >
                            URL
                        </label>
                        <input
                            id="bookmark-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--accent)'
                                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border)'
                                e.target.style.boxShadow = 'none'
                            }}
                        />
                    </div>

                    {/* Title Input */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label
                            htmlFor="bookmark-title"
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                        >
                            Title
                        </label>
                        <input
                            id="bookmark-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My favorite site"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--accent)'
                                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border)'
                                e.target.style.boxShadow = 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="animate-slide-down"
                        style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#ef4444',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div
                        className="animate-slide-down"
                        style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            color: '#22c55e',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Bookmark saved successfully!
                    </div>
                )}

                {/* Submit */}
                <button
                    id="add-bookmark-btn"
                    type="submit"
                    disabled={loading}
                    style={{
                        alignSelf: 'flex-start',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: loading
                            ? 'var(--bg-card)'
                            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: loading ? 'var(--text-muted)' : 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.5)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)'
                    }}
                >
                    {loading ? (
                        <>
                            <div className="spinner" style={{ width: '16px', height: '16px' }} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                            </svg>
                            Save Bookmark
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
