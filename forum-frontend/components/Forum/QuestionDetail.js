import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import api, { errorMessage } from '../../lib/api'
import { useUser } from '../../lib/auth'
import { timeAgo, fullDate, plural, threadTitle } from '../../lib/format'
import Avatar from '../UI/Avatar'
import { IconArrowLeft, IconChat, IconTrash } from '../UI/Icons'
import AnswerList from './AnswerList'
import AnswerForm from './AnswerForm'

const QuestionDetail = ({ id }) => {
    const router = useRouter()
    const user = useUser()
    const [question, setQuestion] = useState(null)
    const [answers, setAnswers] = useState([])
    const [loadError, setLoadError] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            try {
                const [questionRes, answersRes] = await Promise.all([
                    api.get(`/questions/${id}`),
                    api.get(`/questions/${id}/answers`),
                ])
                setQuestion(questionRes.data)
                setAnswers(answersRes.data)
            } catch (err) {
                setLoadError(errorMessage(err, 'Could not load this thread'))
            }
        }

        fetchData()
    }, [id])

    const deleteQuestion = async () => {
        if (!confirm('Delete this thread and all its replies?')) return
        try {
            await api.delete(`/questions/${id}`)
            router.push('/')
        } catch (err) {
            setError(errorMessage(err, 'Could not delete thread'))
        }
    }

    const deleteAnswer = async (answerId) => {
        if (!confirm('Delete this reply?')) return
        try {
            await api.delete(`/answers/${answerId}`)
            setAnswers((prev) => prev.filter((a) => a._id !== answerId))
        } catch (err) {
            setError(errorMessage(err, 'Could not delete reply'))
        }
    }

    const likeAnswer = async (answerId) => {
        try {
            const res = await api.post(`/answers/${answerId}/like`)
            setAnswers((prev) => prev.map((a) => {
                if (a._id !== answerId) return a
                const others = (a.liked_by || []).filter((uid) => uid !== user._id)
                return {
                    ...a,
                    gained_likes_number: res.data.gained_likes_number,
                    liked_by: res.data.liked ? [...others, user._id] : others,
                }
            }))
        } catch (err) {
            setError(errorMessage(err, 'Could not like reply'))
        }
    }

    if (loadError) {
        return (
            <div className="card empty-state">
                <IconChat size={36} />
                <h2>Thread not found</h2>
                <p>{loadError}</p>
                <Link href="/" className="btn btn-secondary btn-sm">Back to discussions</Link>
            </div>
        )
    }

    if (!question) {
        return (
            <div>
                <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 16 }} />
                <div className="skeleton" style={{ width: '70%', height: 28, marginBottom: 24 }} />
                <div className="card card-pad">
                    <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 14 }} />
                    <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '85%', height: 14 }} />
                </div>
            </div>
        )
    }

    const title = threadTitle(question)
    const author = question.user_id
    const isOwnQuestion = user && author?._id === user._id

    return (
        <div style={{ maxWidth: 820 }}>
            <Head>
                <title>{`${title} · Forum`}</title>
            </Head>

            <nav className="breadcrumb">
                <Link href="/"><IconArrowLeft size={13} style={{ verticalAlign: '-2px' }} /> Discussions</Link>
                <span>/</span>
                <span>{title}</span>
            </nav>

            <div className="thread-head">
                <h1>{title}</h1>
                <div className="meta">
                    <span>Started by <strong>{author?.name || 'Unknown user'}</strong></span>
                    <span className="dot" />
                    <span title={fullDate(question.date)}>{timeAgo(question.date)}</span>
                    <span className="dot" />
                    <span>{plural(answers.length, 'reply', 'replies')}</span>
                </div>
            </div>

            {error && <p className="alert alert-error">{error}</p>}

            <div className="card">
                <article className="post post-original">
                    <Avatar name={author?.name} size={44} />
                    <div style={{ minWidth: 0 }}>
                        <div className="post-header">
                            <span className="post-author">{author?.name || 'Unknown user'}</span>
                            <span className="badge badge-accent">Author</span>
                            <span className="post-time" title={fullDate(question.date)}>{timeAgo(question.date)}</span>
                        </div>
                        <div className="post-body">{question.question_text}</div>
                        {isOwnQuestion && (
                            <div className="post-actions">
                                <button className="text-btn danger" onClick={deleteQuestion}>
                                    <IconTrash size={14} /> Delete thread
                                </button>
                            </div>
                        )}
                    </div>
                </article>
            </div>

            <h2 className="section-title">
                {plural(answers.length, 'Reply', 'Replies')}
            </h2>

            <AnswerList
                answers={answers}
                user={user}
                questionAuthorId={author?._id}
                onDelete={deleteAnswer}
                onLike={likeAnswer}
            />

            {user && (
                <AnswerForm
                    questionId={id}
                    user={user}
                    onCreated={(answer) => setAnswers((prev) => [...prev, answer])}
                />
            )}
            {user === null && (
                <div className="card empty-state" style={{ marginTop: 16 }}>
                    <h2>Join the discussion</h2>
                    <p>Log in or create an account to reply.</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/auth?next=${encodeURIComponent(router.asPath)}`} className="btn btn-secondary btn-sm">Log in</Link>
                        <Link href={`/auth?mode=register&next=${encodeURIComponent(router.asPath)}`} className="btn btn-primary btn-sm">Sign up</Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionDetail
