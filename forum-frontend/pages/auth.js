import React from 'react'
import { useRouter } from 'next/router'
import Register from '../components/Auth/Register'
import Login from '../components/Auth/Login'
import Layout from '../components/Layout/Layout'
import { IconChat } from '../components/UI/Icons'

const Auth = () => {
    const router = useRouter()
    const isRegister = router.query.mode === 'register'

    const switchMode = (mode) => {
        const query = { ...router.query }
        if (mode === 'register') query.mode = 'register'
        else delete query.mode
        router.replace({ pathname: '/auth', query }, undefined, { shallow: true })
    }

    return (
        <Layout title={isRegister ? 'Sign up' : 'Log in'}>
            <div className="auth-wrap">
                <div className="card auth-card">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                        <span className="brand-mark" style={{ width: 44, height: 44, borderRadius: 12 }}>
                            <IconChat size={24} />
                        </span>
                    </div>
                    <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
                    <p className="muted">
                        {isRegister ? 'Join the community and start posting.' : 'Log in to post threads and replies.'}
                    </p>

                    <div className="tabs auth-tabs" role="tablist">
                        <button role="tab" aria-selected={!isRegister} className={`tab ${!isRegister ? 'active' : ''}`} onClick={() => switchMode('login')}>
                            Log in
                        </button>
                        <button role="tab" aria-selected={isRegister} className={`tab ${isRegister ? 'active' : ''}`} onClick={() => switchMode('register')}>
                            Sign up
                        </button>
                    </div>

                    {isRegister ? <Register /> : <Login />}

                    <p className="auth-switch">
                        {isRegister ? 'Already have an account? ' : 'New here? '}
                        <button className="link-btn" onClick={() => switchMode(isRegister ? 'login' : 'register')}>
                            {isRegister ? 'Log in' : 'Create an account'}
                        </button>
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Auth
