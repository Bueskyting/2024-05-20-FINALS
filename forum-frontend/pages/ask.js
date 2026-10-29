import React from 'react'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import QuestionForm from '../components/Forum/QuestionForm'
import { useUser } from '../lib/auth'

const Ask = () => {
    const user = useUser()

    return (
        <Layout title="New thread">
            <div className="page-head">
                <div>
                    <h1>Start a new thread</h1>
                    <p className="muted">A clear title and enough detail get you better answers, faster.</p>
                </div>
            </div>

            <div className="layout-grid">
                <div>
                    {user && <QuestionForm />}
                    {user === null && (
                        <div className="card empty-state">
                            <h2>Log in to start a thread</h2>
                            <p>You need an account to post in the forum.</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Link href="/auth?next=/ask" className="btn btn-secondary btn-sm">Log in</Link>
                                <Link href="/auth?mode=register&next=/ask" className="btn btn-primary btn-sm">Sign up</Link>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="sidebar">
                    <div className="card card-pad">
                        <h3>Writing a good thread</h3>
                        <ul className="rules">
                            <li>Sum up the problem in the title.</li>
                            <li>Explain what you've already tried.</li>
                            <li>Include error messages word for word.</li>
                            <li>Keep it to one question per thread.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </Layout>
    )
}

export default Ask
