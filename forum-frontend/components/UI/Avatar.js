import React from 'react'

const COLORS = ['#0d7a6b', '#2f6fd0', '#8a4fd3', '#c2410c', '#be2f6b', '#4d7c0f', '#0e7490', '#a16207']

const Avatar = ({ name, size = 40 }) => {
    const safeName = name || '?'
    const initials = safeName.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || '?'

    let hash = 0
    for (const char of safeName) hash = (hash * 31 + char.charCodeAt(0)) | 0
    const color = COLORS[Math.abs(hash) % COLORS.length]

    return (
        <span
            className="avatar"
            style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.38) }}
            aria-hidden="true"
        >
            {initials}
        </span>
    )
}

export default Avatar
