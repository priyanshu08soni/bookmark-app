export default function EmptyState() {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '64px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
            }}
        >
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                }}
            >
                <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
            </div>

            <div>
                <h3
                    style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                    }}
                >
                    No bookmarks yet
                </h3>
                <p
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        maxWidth: '280px',
                    }}
                >
                    Add your first bookmark above to start building your personal collection.
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                {[
                    '📰 Articles',
                    '🎥 Videos',
                    '🛠️ Tools',
                    '📚 Docs',
                ].map((tag) => (
                    <span
                        key={tag}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '100px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                            fontSize: '12px',
                            fontWeight: '500',
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}
