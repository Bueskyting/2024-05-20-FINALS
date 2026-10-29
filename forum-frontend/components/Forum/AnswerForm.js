import React, { useState } from 'react'
import api, { errorMessage } from '../../lib/api'
import Avatar from '../UI/Avatar'

const AnswerForm = ({ questionId, user, onCreated }) => {
    const [answerText, setAnswerText] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!answerText.trim()) {
            setError('Reply cannot be empty')
            return
        }

        setLoading(true)
        try {
            const res = await api.post(`/questions/${questionId}/answers`, { answer_text: answerText })
            onCreated(res.data)
            setAnswerText('')
        } catch (err) {
            setError(errorMessage(err, 'Could not post reply'))
        }
        setLoading(false)
    }

    // Ctrl/Cmd + Enter posts the reply
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e)
    }

    return (
        <form className="card composer" onSubmit={handleSubmit}>
            <Avatar name={user.name} size={44} />
            <div>
                {error && <p className="alert alert-error">{error}</p>}
                <textarea
                    className="textarea"
                    name="answer"
                    placeholder="Write a reply..."
                    aria-label="Your reply"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="composer-footer">
                    <span className="hint">Replying as <strong>{user.name}</strong> · Ctrl + Enter to post</span>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Posting...' : 'Post reply'}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AnswerForm
