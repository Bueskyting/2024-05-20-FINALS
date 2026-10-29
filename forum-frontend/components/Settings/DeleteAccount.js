import React, { useState } from 'react'
import { useRouter } from 'next/router'
import api, { errorMessage } from '../../lib/api'
import { clearAuth } from '../../lib/auth'
import { plural } from '../../lib/format'

const DeleteAccount = ({ stats }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const cancel = () => {
        setOpen(false)
        setPassword('')
        setError('')
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        if (!password) {
            setError('Enter your password to confirm')
            return
        }

        setLoading(true)
        try {
            await api.delete('/auth/me', { data: { password } })
            clearAuth()
            router.push('/')
        } catch (err) {
            setError(errorMessage(err, 'Could not delete account'))
            setLoading(false)
        }
    }

    return (
        <section id="delete" className="card settings-section danger-zone">
            <header>
                <h2>Delete account</h2>
                <p className="muted">
                    Permanently removes your account
                    {stats && (
                        <>
                            , your {plural(stats.threads, 'thread', 'threads')} (with all their replies),
                            your {plural(stats.replies, 'reply', 'replies')} and every like you've given
                        </>
                    )}
                    . This can't be undone.
                </p>
            </header>

            {!open && (
                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                    <button type="button" className="btn btn-danger" onClick={() => setOpen(true)}>
                        Delete my account
                    </button>
                </div>
            )}

            {open && (
                <form onSubmit={handleDelete} className="danger-confirm">
                    {error && <p className="alert alert-error">{error}</p>}
                    <div className="field">
                        <label htmlFor="delete-password">Enter your password to confirm</label>
                        <input
                            id="delete-password"
                            className="input"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={cancel} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-danger" disabled={loading}>
                            {loading ? 'Deleting...' : 'Delete forever'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    )
}

export default DeleteAccount
