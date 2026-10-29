import React from 'react'
import { useRouter } from 'next/router'
import { timeAgo, fullDate } from '../../lib/format'
import Avatar from '../UI/Avatar'
import { IconHeart, IconTrash } from '../UI/Icons'

const AnswerList = ({ answers, user, questionAuthorId, onDelete, onLike }) => {
    const router = useRouter()

    if (answers.length === 0) {
        return (
            <div className="card empty-state">
                <h2>No replies yet</h2>
                <p>Know the answer? Be the first to reply.</p>
            </div>
        )
    }

    return (
        <div className="card">
            {answers.map((answer, index) => {
                const authorId = answer.user_id?._id
                const isOwn = user && authorId === user._id
                const liked = user && (answer.liked_by || []).includes(user._id)

                const handleLike = () => {
                    if (!user) return router.push(`/auth?next=${encodeURIComponent(router.asPath)}`)
                    onLike(answer._id)
                }

                return (
                    <article key={answer._id} id={`reply-${answer._id}`} className="post">
                        <Avatar name={answer.user_id?.name} size={44} />
                        <div style={{ minWidth: 0 }}>
                            <div className="post-header">
                                <span className="post-author">{answer.user_id?.name || 'Unknown user'}</span>
                                {authorId && authorId === questionAuthorId && <span className="badge badge-accent">Author</span>}
                                <span className="post-time" title={fullDate(answer.date)}>{timeAgo(answer.date)}</span>
                                <a href={`#reply-${answer._id}`} className="post-number">#{index + 1}</a>
                            </div>
                            <div className="post-body">{answer.answer_text}</div>
                            <div className="post-actions">
                                <button
                                    className={`like-btn ${liked ? 'is-liked' : ''}`}
                                    onClick={handleLike}
                                    disabled={isOwn}
                                    title={isOwn ? 'You can\'t like your own reply' : liked ? 'Unlike' : 'Like this reply'}
                                    aria-pressed={!!liked}
                                >
                                    <IconHeart size={14} filled={liked} />
                                    {answer.gained_likes_number || 0}
                                </button>
                                {isOwn && (
                                    <button className="text-btn danger" onClick={() => onDelete(answer._id)}>
                                        <IconTrash size={14} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}

export default AnswerList
