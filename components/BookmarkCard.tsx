'use client'

import type { Bookmark } from './Dashboard'

interface BookmarkCardProps {
    bookmark: Bookmark
    onDelete: (id: string) => void
    isDeleting: boolean
    index: number
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '')
    } catch {
        return url
    }
}

function getFaviconUrl(url: string): string {
    try {
        const domain = new URL(url).origin
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
        return ''
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function BookmarkCard({
    bookmark,
    onDelete,
    isDeleting,
    index,
}: BookmarkCardProps) {
    const domain = getDomain(bookmark.url)
    const faviconUrl = getFaviconUrl(bookmark.url)

    return (
        <div
            className="animate-fade-in"
            style={{
                animationDelay: `${index * 50}ms`,
                opacity: isDeleting ? 0.4 : 1,
                transform: isDeleting ? 'scale(0.98)' : 'scale(1)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
        >
            <div
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-hover)'
                    e.currentTarget.style.background = 'var(--bg-card-hover)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--bg-card)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
            >
                {/* Favicon */}
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                    }}
                >
                    {faviconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={faviconUrl}
                            alt={domain}
                            width={20}
                            height={20}
                            style={{ objectFit: 'contain' }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                    parent.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
                                }
                            }}
                        />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontWeight: '600',
                            fontSize: '15px',
                            color: 'var(--text-primary)',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {bookmark.title}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`bookmark-link-${bookmark.id}`}
                            style={{
                                color: 'var(--accent)',
                                fontSize: '13px',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#818cf8'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--accent)'
                            }}
                        >
                            {domain}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                        <span style={{ color: 'var(--border-hover)', fontSize: '12px' }}>·</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                            {formatDate(bookmark.created_at)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {/* Open link button */}
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open link"
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '9px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)'
                            e.currentTarget.style.color = 'var(--accent)'
                            e.currentTarget.style.background = 'var(--accent-glow)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)'
                            e.currentTarget.style.color = 'var(--text-muted)'
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>

                    {/* Delete button */}
                    <button
                        id={`delete-bookmark-${bookmark.id}`}
                        onClick={() => onDelete(bookmark.id)}
                        disabled={isDeleting}
                        title="Delete bookmark"
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '9px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                            if (!isDeleting) {
                                e.currentTarget.style.borderColor = 'var(--danger)'
                                e.currentTarget.style.color = 'var(--danger)'
                                e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)'
                            e.currentTarget.style.color = 'var(--text-muted)'
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        {isDeleting ? (
                            <div className="spinner" style={{ width: '14px', height: '14px' }} />
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
