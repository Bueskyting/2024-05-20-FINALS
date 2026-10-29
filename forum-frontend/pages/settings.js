import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout/Layout'
import Avatar from '../components/UI/Avatar'
import ProfileForm from '../components/Settings/ProfileForm'
import PasswordForm from '../components/Settings/PasswordForm'
import ThemePicker from '../components/Settings/ThemePicker'
import DeleteAccount from '../components/Settings/DeleteAccount'
import { IconLogout } from '../components/UI/Icons'
import api from '../lib/api'
import { useUser, clearAuth } from '../lib/auth'

const SECTIONS = [
    ['profile', 'Profile'],
    ['password', 'Password'],
    ['appearance', 'Appearance'],
    ['delete', 'Delete account'],
]

const Settings = () => {
    const router = useRouter()
    const user = useUser()
    const [profile, setProfile] = useState(null)

    const loadProfile = useCallback(async () => {
        try {
            const res = await api.get('/auth/me')
            setProfile(res.data)
        } catch (err) {
            // The account no longer exists (e.g. deleted in another tab)
            if (err.response?.status === 404) clearAuth()
        }
    }, [])

    useEffect(() => {
        if (user) loadProfile()
    }, [user?._id, loadProfile]) // eslint-disable-line react-hooks/exhaustive-deps

    const logout = () => {
        clearAuth()
        router.push('/')
    }

    return (
        <Layout title="Settings">
            <div className="page-head">
                <div>
                    <h1>Settings</h1>
                    <p className="muted">Manage your profile, password and how the forum looks.</p>
                </div>
            </div>

            {user === null && (
                <div className="settings-stack">
                    <div className="card empty-state">
                        <h2>Log in to manage your account</h2>
                        <p>You can still pick a theme below without an account.</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Link href="/auth?next=/settings" className="btn btn-secondary btn-sm">Log in</Link>
                            <Link href="/auth?mode=register&next=/settings" className="btn btn-primary btn-sm">Sign up</Link>
                        </div>
                    </div>
                    <ThemePicker />
                </div>
            )}

            {user && (
                <div className="layout-grid settings-grid">
                    <div className="settings-stack">
                        <ProfileForm key={user._id} user={user} onSaved={loadProfile} />
                        <PasswordForm />
                        <ThemePicker />
                        <DeleteAccount stats={profile?.stats} />
                    </div>

                    <aside className="sidebar">
                        <div className="card card-pad profile-card">
                            <Avatar name={user.name} size={64} />
                            <h2>{user.name}</h2>
                            <p className="muted">{user.email}</p>
                            {profile && (
                                <p className="faint profile-joined">
                                    Member since {new Date(profile.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                </p>
                            )}
                            <div className="stat-grid stat-grid-3">
                                <div className="stat"><strong>{profile ? profile.stats.threads : '–'}</strong><span>Threads</span></div>
                                <div className="stat"><strong>{profile ? profile.stats.replies : '–'}</strong><span>Replies</span></div>
                                <div className="stat"><strong>{profile ? profile.stats.likes : '–'}</strong><span>Likes</span></div>
                            </div>
                            <button type="button" className="btn btn-secondary btn-block" onClick={logout}>
                                <IconLogout size={15} /> Log out
                            </button>
                        </div>

                        <nav className="card card-pad settings-nav" aria-label="Settings sections">
                            <h3>On this page</h3>
                            {SECTIONS.map(([id, label]) => (
                                <a key={id} href={`#${id}`} className={id === 'delete' ? 'danger' : ''}>{label}</a>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}
        </Layout>
    )
}

export default Settings
