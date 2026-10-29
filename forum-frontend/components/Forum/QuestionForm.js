import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import api, { errorMessage } from '../../lib/api'

const TITLE_MAX = 150

const QuestionForm = () => {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [questionText, setQuestionText] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!title.trim() || !questionText.trim()) {
            setError('Please add both a title and some details')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/questions', { title, question_text: questionText })
            router.push(`/question/${res.data._id}`)
        } catch (err) {
            setError(errorMessage(err, 'Could not create thread'))
            setLoading(false)
        }
    }

    return (
        <form className="card card-pad" onSubmit={handleSubmit}>
            {error && <p className="alert alert-error">{error}</p>}

            <div className="field">
                <div className="field-row">
                    <label htmlFor="title">Title</label>
                    <span className="hint">{title.length}/{TITLE_MAX}</span>
                </div>
                <input
                    id="title"
                    className="input"
                    placeholder="What's your question? Be specific."
                    maxLength={TITLE_MAX}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="field">
                <label htmlFor="details">Details</label>
                <textarea
                    id="details"
                    className="textarea textarea-lg"
                    placeholder="Give people the context they need to help: what you tried, what you expected, what happened."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                />
            </div>

            <div className="form-actions">
                <Link href="/" className="btn btn-ghost">Cancel</Link>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Posting...' : 'Post thread'}
                </button>
            </div>
        </form>
    )
}

export default QuestionForm
