import React, { useState } from 'react'
import api, { errorMessage } from '../../lib/api'
import { saveAuth } from '../../lib/auth'

const ProfileForm = ({ user, onSaved }) => {
    const [formData, setFormData] = useState({ name: user.name, email: user.email })
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const changed = formData.name.trim() !== user.name || formData.email.trim() !== user.email

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setStatus({ type: '', message: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.email.trim()) {
            setStatus({ type: 'error', message: 'Name and email are required' })
            return
        }

        setLoading(true)
        try {
            const res = await api.patch('/auth/me', formData)
            saveAuth(res.data)
            setFormData({ name: res.data.result.name, email: res.data.result.email })
            setStatus({ type: 'success', message: 'Profile updated' })
            onSaved?.()
        } catch (err) {
            setStatus({ type: 'error', message: errorMessage(err, 'Could not update profile') })
        }
        setLoading(false)
    }

    return (
        <section id="profile" className="card settings-section">
            <header>
                <h2>Profile</h2>
                <p className="muted">Your name is shown next to everything you post.</p>
            </header>
            <form onSubmit={handleSubmit}>
                {status.message && <p className={`alert alert-${status.type}`}>{status.message}</p>}
                <div className="field-grid">
                    <div className="field">
                        <label htmlFor="profile-name">Display name</label>
                        <input
                            id="profile-name"
                            className="input"
                            name="name"
                            maxLength={50}
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="profile-email">Email</label>
                        <input
                            id="profile-email"
                            className="input"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading || !changed}>
                        {loading ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default ProfileForm
