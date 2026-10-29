import React, { useState } from 'react'
import { useRouter } from 'next/router'
import api, { errorMessage } from '../../lib/api'
import { saveAuth, safeRedirect } from '../../lib/auth'

const Register = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.email || !formData.password || !formData.name) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/register', formData)
            saveAuth(res.data)
            router.push(safeRedirect(router.query.next))
        } catch (err) {
            setError(errorMessage(err, 'Registration failed'))
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="alert alert-error">{error}</p>}
            <div className="field">
                <label htmlFor="register-name">Display name</label>
                <input
                    id="register-name"
                    className="input"
                    type="text"
                    name="name"
                    autoComplete="nickname"
                    placeholder="How others will see you"
                    onChange={handleChange}
                    value={formData.name}
                />
            </div>
            <div className="field">
                <label htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    className="input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    value={formData.email}
                />
            </div>
            <div className="field">
                <label htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    className="input"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Choose a password"
                    onChange={handleChange}
                    value={formData.password}
                />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
            </button>
        </form>
    )
}

export default Register
