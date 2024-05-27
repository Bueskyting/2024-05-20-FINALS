import React, { useState } from 'react'
import axios from 'axios'

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/auth/register', formData)
            console.log(res.data)

        } catch (err) {
            setError(err.response.data.message || 'Registration failed')
        }
    }

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register