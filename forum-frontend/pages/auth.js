import React from 'react'
import Register from '../components/Auth/Register'
import Login from '../components/Auth/Login'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const Auth = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to poorly functioning forum</h1>
                <Register />
                <Login />
            </main>
            <Footer />
        </div>
    )
}

export default Auth