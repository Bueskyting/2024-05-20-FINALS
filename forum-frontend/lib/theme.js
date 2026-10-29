import { useEffect, useState } from 'react'

const THEME_KEY = 'theme'
const THEME_EVENT = 'theme-change'
export const THEMES = ['system', 'light', 'dark']

export const getTheme = () => {
    if (typeof window === 'undefined') return 'system'
    try {
        const theme = localStorage.getItem(THEME_KEY)
        return THEMES.includes(theme) ? theme : 'system'
    } catch {
        return 'system'
    }
}

// "system" removes the attribute so the CSS follows the OS setting
const applyTheme = (theme) => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
}

export const setTheme = (theme) => {
    try {
        if (theme === 'system') localStorage.removeItem(THEME_KEY)
        else localStorage.setItem(THEME_KEY, theme)
    } catch {}
    applyTheme(theme)
    window.dispatchEvent(new Event(THEME_EVENT))
}

// Runs in _document.js before the page paints, so a saved theme never flashes the wrong colours
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`

export const useTheme = () => {
    const [theme, setThemeState] = useState('system')

    useEffect(() => {
        const update = () => {
            const current = getTheme()
            applyTheme(current)
            setThemeState(current)
        }
        update()
        window.addEventListener(THEME_EVENT, update)
        window.addEventListener('storage', update)
        return () => {
            window.removeEventListener(THEME_EVENT, update)
            window.removeEventListener('storage', update)
        }
    }, [])

    return [theme, setTheme]
}
