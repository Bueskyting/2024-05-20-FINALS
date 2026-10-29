import React from 'react'
import Link from 'next/link'
import { IconPlus } from '../UI/Icons'

const Sidebar = ({ user, threadCount, replyCount, memberCount }) => {
    return (
        <aside className="sidebar">
            <div className="card card-pad sidebar-cta">
                {user ? (
                    <>
                        <h2>Got something to ask?</h2>
                        <p className="muted">Start a thread and let the community help you out.</p>
                        <Link href="/ask" className="btn btn-primary btn-block">
                            <IconPlus size={15} /> New thread
                        </Link>
                    </>
                ) : (
                    <>
                        <h2>Join the conversation</h2>
                        <p className="muted">Create a free account to start threads, reply and like answers.</p>
                        <Link href="/auth?mode=register" className="btn btn-primary btn-block">Create account</Link>
                    </>
                )}
            </div>

            <div className="card card-pad">
                <h3>Community</h3>
                <div className="stat-grid">
                    <div className="stat">
                        <strong>{threadCount}</strong>
                        <span>Threads</span>
                    </div>
                    <div className="stat">
                        <strong>{replyCount}</strong>
                        <span>Replies</span>
                    </div>
                    <div className="stat">
                        <strong>{memberCount}</strong>
                        <span>Active authors</span>
                    </div>
                    <div className="stat">
                        <strong>{threadCount ? Math.round((replyCount / threadCount) * 10) / 10 : 0}</strong>
                        <span>Replies / thread</span>
                    </div>
                </div>
            </div>

            <div className="card card-pad">
                <h3>Guidelines</h3>
                <ul className="rules">
                    <li>Search before posting a new thread.</li>
                    <li>Use a clear, specific title.</li>
                    <li>Be respectful. Critique ideas, not people.</li>
                    <li>Like the replies that helped you.</li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
