import React, { useState } from 'react'
import axios from 'axios'
import styles from "./Login.module.css"

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!formData.email || !formData.password) {
            setError('Please fill in both fields')
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/auth/login', formData)
            setLoading(false)
            setSuccess('Login successful')
            console.log(res.data)
        } catch (err) {
            setLoading(false)
            setError(err.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    value={formData.email}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    value={formData.password}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default Login