import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import api, { errorMessage } from '../../lib/api'
import { useUser } from '../../lib/auth'
import { timeAgo, fullDate, threadTitle, threadExcerpt } from '../../lib/format'
import Avatar from '../UI/Avatar'
import { IconChat, IconPlus } from '../UI/Icons'
import Sidebar from './Sidebar'

const TABS = [
    { id: 'latest', label: 'Latest' },
    { id: 'active', label: 'Active' },
    { id: 'unanswered', label: 'Unanswered' },
]

const SkeletonRows = () => (
    <ul className="thread-list">
        {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="thread-row">
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div>
                    <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '35%', height: 12 }} />
                </div>
                <div className="skeleton" style={{ width: 64, height: 40 }} />
            </li>
        ))}
    </ul>
)

const QuestionList = () => {
    const router = useRouter()
    const user = useUser()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [tab, setTab] = useState('latest')
    const search = typeof router.query.q === 'string' ? router.query.q.trim() : ''

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/questions')
                setQuestions(res.data)
            } catch (err) {
                setError(errorMessage(err, 'Could not load discussions'))
            }
            setLoading(false)
        }

        fetchQuestions()
    }, [])

    const visible = useMemo(() => {
        const needle = search.toLowerCase()
        let list = questions.filter((q) =>
            !needle ||
            (q.title || '').toLowerCase().includes(needle) ||
            q.question_text.toLowerCase().includes(needle) ||
            (q.user_id?.name || '').toLowerCase().includes(needle)
        )
        if (tab === 'active') list = [...list].sort((a, b) => new Date(b.last_activity) - new Date(a.last_activity))
        if (tab === 'unanswered') list = list.filter((q) => q.answer_count === 0)
        return list
    }, [questions, search, tab])

    const replyCount = questions.reduce((sum, q) => sum + q.answer_count, 0)
    const memberCount = new Set(questions.map((q) => q.user_id?._id).filter(Boolean)).size

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>{search ? 'Search results' : 'Discussions'}</h1>
                    <p className="muted">
                        {search
                            ? <>Threads matching “{search}” · <Link href="/">Clear search</Link></>
                            : 'Ask questions, share what you know, and help each other out.'}
                    </p>
                </div>
            </div>

            <div className="layout-grid">
                <section className="card">
                    <div className="toolbar">
                        <div className="tabs" role="tablist">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    role="tab"
                                    aria-selected={tab === t.id}
                                    className={`tab ${tab === t.id ? 'active' : ''}`}
                                    onClick={() => setTab(t.id)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {!loading && <span className="toolbar-note">{visible.length} of {questions.length} threads</span>}
                    </div>

                    {loading && <SkeletonRows />}

                    {!loading && error && (
                        <div className="empty-state">
                            <h2>Something went wrong</h2>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && visible.length === 0 && (
                        <div className="empty-state">
                            <IconChat size={36} />
                            {search ? (
                                <>
                                    <h2>No threads found</h2>
                                    <p>Nothing matches “{search}”. Try different words.</p>
                                </>
                            ) : tab === 'unanswered' && questions.length > 0 ? (
                                <>
                                    <h2>Every thread has a reply</h2>
                                    <p>Nice work, community.</p>
                                </>
                            ) : (
                                <>
                                    <h2>No discussions yet</h2>
                                    <p>Be the first to start one.</p>
                                    <Link href={user ? '/ask' : '/auth?mode=register'} className="btn btn-primary btn-sm">
                                        <IconPlus size={15} /> Start a thread
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {!loading && !error && visible.length > 0 && (
                        <ul className="thread-list">
                            {visible.map((question) => (
                                <li key={question._id} className="thread-row">
                                    <Avatar name={question.user_id?.name} size={40} />
                                    <div style={{ minWidth: 0 }}>
                                        <Link href={`/question/${question._id}`} className="thread-title">
                                            {threadTitle(question)}
                                        </Link>
                                        {threadExcerpt(question) && <p className="thread-excerpt">{threadExcerpt(question)}</p>}
                                        <div className="meta">
                                            <strong>{question.user_id?.name || 'Unknown user'}</strong>
                                            <span className="dot" />
                                            <span title={fullDate(question.date)}>{timeAgo(question.date)}</span>
                                        </div>
                                    </div>
                                    <div className="thread-stats">
                                        <div className={`reply-count ${question.answer_count ? 'has-replies' : ''}`}>
                                            <strong>{question.answer_count}</strong>
                                            <span>{question.answer_count === 1 ? 'reply' : 'replies'}</span>
                                        </div>
                                        <div className="last-activity" title={fullDate(question.last_activity)}>
                                            {question.answer_count ? 'Last reply' : 'Posted'}<br />
                                            {timeAgo(question.last_activity)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <Sidebar user={user} threadCount={questions.length} replyCount={replyCount} memberCount={memberCount} />
            </div>
        </>
    )
}

export default QuestionList
