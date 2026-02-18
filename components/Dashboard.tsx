'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/app/actions/auth'
import type { User } from '@supabase/supabase-js'
import AddBookmarkForm from './AddBookmarkForm'
import BookmarkCard from './BookmarkCard'
import EmptyState from './EmptyState'

export interface Bookmark {
    id: string
    user_id: string
    url: string
    title: string
    created_at: string
}

interface DashboardProps {
    user: User
}

export default function Dashboard({ user }: DashboardProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const supabase = createClient()

    const fetchBookmarks = useCallback(async () => {
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setBookmarks(data)
        }
        setLoading(false)
    }, [supabase, user.id])

    useEffect(() => {
        fetchBookmarks()

        // Real-time subscription
        const channel = supabase
            .channel(`bookmarks:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark
                        setBookmarks((prev) => {
                            if (prev.some((b) => b.id === newBookmark.id)) return prev
                            return [newBookmark, ...prev]
                        })
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== payload.old.id)
                        )
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) =>
                                b.id === payload.new.id ? (payload.new as Bookmark) : b
                            )
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchBookmarks, supabase, user.id])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Delete error:', error)
            setDeletingId(null)
        }
        // Realtime will handle state update
        setTimeout(() => setDeletingId(null), 500)
    }

    const avatarUrl = user.user_metadata?.avatar_url as string | undefined
    const displayName = (user.user_metadata?.full_name as string) || user.email || 'User'
    const firstName = displayName.split(' ')[0]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header
                className="glass"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    borderBottom: '1px solid var(--border)',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderRadius: 0,
                }}
            >
                <div
                    style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        padding: '0 24px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span
                            style={{
                                fontWeight: '700',
                                fontSize: '17px',
                                letterSpacing: '-0.3px',
                            }}
                            className="gradient-text"
                        >
                            BookmarkVault
                        </span>
                    </div>

                    {/* User info + sign out */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '6px 12px',
                                borderRadius: '100px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: 'white',
                                    }}
                                >
                                    {firstName[0]?.toUpperCase()}
                                </div>
                            )}
                            <span
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                {firstName}
                            </span>
                        </div>

                        <form action={signOut}>
                            <button
                                id="signout-btn"
                                type="submit"
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--danger)'
                                    e.currentTarget.style.color = 'var(--danger)'
                                    e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)'
                                    e.currentTarget.style.color = 'var(--text-secondary)'
                                    e.currentTarget.style.background = 'transparent'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '40px 24px',
                }}
            >
                {/* Welcome */}
                <div style={{ marginBottom: '32px' }}>
                    <h1
                        style={{
                            fontSize: '26px',
                            fontWeight: '800',
                            letterSpacing: '-0.5px',
                            marginBottom: '6px',
                        }}
                    >
                        Welcome back, {firstName} 👋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                        {bookmarks.length === 0
                            ? 'Start saving your favorite links below.'
                            : `You have ${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''} saved.`}
                    </p>
                </div>

                {/* Add Bookmark Form */}
                <AddBookmarkForm
                    userId={user.id}
                    onBookmarkAdded={(newBookmark) => {
                        setBookmarks((prev) => {
                            if (prev.some(b => b.id === newBookmark.id)) return prev;
                            return [newBookmark, ...prev];
                        });
                    }}
                />

                {/* Bookmarks List */}
                <div style={{ marginTop: '32px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="skeleton"
                                    style={{ height: '88px', borderRadius: '16px' }}
                                />
                            ))}
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                            }}
                        >
                            {bookmarks.map((bookmark, index) => (
                                <BookmarkCard
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    onDelete={handleDelete}
                                    isDeleting={deletingId === bookmark.id}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
