import React, { useState } from 'react'
import { useRouter } from 'next/router'
import api, { errorMessage } from '../../lib/api'
import { saveAuth, safeRedirect } from '../../lib/auth'

const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.email || !formData.password) {
            setError('Please fill in both fields')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/login', formData)
            saveAuth(res.data)
            router.push(safeRedirect(router.query.next))
        } catch (err) {
            setError(errorMessage(err, 'Login failed'))
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="alert alert-error">{error}</p>}
            <div className="field">
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
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
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    className="input"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    onChange={handleChange}
                    value={formData.password}
                />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
            </button>
        </form>
    )
}

export default Login
