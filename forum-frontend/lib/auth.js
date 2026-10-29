import { useEffect, useState } from 'react'

const AUTH_EVENT = 'auth-change'

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem('token'))

export const getUser = () => {
    if (typeof window === 'undefined') return null
    try {
        return JSON.parse(localStorage.getItem('user'))
    } catch {
        return null
    }
}

export const saveAuth = ({ result, token }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(result))
    window.dispatchEvent(new Event(AUTH_EVENT))
}

// Where to go after logging in: only local paths, never another site
export const safeRedirect = (next) =>
    typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/'

export const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event(AUTH_EVENT))
}

// Current logged-in user, kept in sync across components and tabs.
// undefined = not checked yet (same markup on server and client), null = logged out.
export const useUser = () => {
    const [user, setUser] = useState(undefined)

    useEffect(() => {
        const update = () => setUser(getToken() ? getUser() : null)
        update()
        window.addEventListener(AUTH_EVENT, update)
        window.addEventListener('storage', update)
        return () => {
            window.removeEventListener(AUTH_EVENT, update)
            window.removeEventListener('storage', update)
        }
    }, [])

    return user
}
