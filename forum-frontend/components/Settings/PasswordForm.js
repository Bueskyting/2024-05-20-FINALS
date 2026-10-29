import React, { useState } from 'react'
import api, { errorMessage } from '../../lib/api'

const EMPTY = { current_password: '', new_password: '', confirm_password: '' }

const PasswordForm = () => {
    const [formData, setFormData] = useState(EMPTY)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setStatus({ type: '', message: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { current_password, new_password, confirm_password } = formData
        if (!current_password || !new_password) {
            setStatus({ type: 'error', message: 'Fill in your current and new password' })
            return
        }
        if (new_password.length < 6) {
            setStatus({ type: 'error', message: 'New password must be at least 6 characters' })
            return
        }
        if (new_password !== confirm_password) {
            setStatus({ type: 'error', message: 'New passwords don\'t match' })
            return
        }

        setLoading(true)
        try {
            await api.patch('/auth/password', { current_password, new_password })
            setFormData(EMPTY)
            setStatus({ type: 'success', message: 'Password changed' })
        } catch (err) {
            setStatus({ type: 'error', message: errorMessage(err, 'Could not change password') })
        }
        setLoading(false)
    }

    return (
        <section id="password" className="card settings-section">
            <header>
                <h2>Password</h2>
                <p className="muted">Use at least 6 characters. You'll stay logged in on this device.</p>
            </header>
            <form onSubmit={handleSubmit}>
                {status.message && <p className={`alert alert-${status.type}`}>{status.message}</p>}
                <div className="field">
                    <label htmlFor="current-password">Current password</label>
                    <input
                        id="current-password"
                        className="input"
                        type="password"
                        name="current_password"
                        autoComplete="current-password"
                        value={formData.current_password}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-grid">
                    <div className="field">
                        <label htmlFor="new-password">New password</label>
                        <input
                            id="new-password"
                            className="input"
                            type="password"
                            name="new_password"
                            autoComplete="new-password"
                            value={formData.new_password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="confirm-password">Confirm new password</label>
                        <input
                            id="confirm-password"
                            className="input"
                            type="password"
                            name="confirm_password"
                            autoComplete="new-password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update password'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default PasswordForm
