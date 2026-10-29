import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser, clearAuth } from '../../lib/auth'
import Avatar from '../UI/Avatar'
import { IconChat, IconSearch, IconPlus, IconLogout } from '../UI/Icons'

const Header = () => {
    const router = useRouter()
    const user = useUser()
    const [search, setSearch] = useState('')

    // Keep the search box in sync with ?q= on the home page
    useEffect(() => {
        setSearch(typeof router.query.q === 'string' ? router.query.q : '')
    }, [router.query.q])

    const handleSearch = (e) => {
        e.preventDefault()
        const q = search.trim()
        router.push(q ? { pathname: '/', query: { q } } : '/')
    }

    const logout = () => {
        clearAuth()
        router.push('/')
    }

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="brand">
                    <span className="brand-mark"><IconChat size={18} /></span>
                    Forum
                </Link>

                <form className="search" onSubmit={handleSearch} role="search">
                    <IconSearch />
                    <input
                        type="search"
                        placeholder="Search discussions"
                        aria-label="Search discussions"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className="header-actions">
                    {user && (
                        <>
                            <Link href="/ask" className="btn btn-primary btn-sm">
                                <IconPlus size={15} /> New thread
                            </Link>
                            <Link href="/settings" className="user-chip" title="Account settings">
                                <Avatar name={user.name} size={30} />
                                <span className="user-chip-name">{user.name}</span>
                            </Link>
                            <button className="btn btn-ghost btn-sm" onClick={logout} title="Log out" aria-label="Log out">
                                <IconLogout size={16} />
                            </button>
                        </>
                    )}
                    {user === null && (
                        <>
                            <Link href="/auth" className="btn btn-ghost btn-sm">Log in</Link>
                            <Link href="/auth?mode=register" className="btn btn-primary btn-sm">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
