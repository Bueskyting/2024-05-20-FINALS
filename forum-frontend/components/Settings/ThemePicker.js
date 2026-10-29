import React from 'react'
import { useTheme } from '../../lib/theme'
import { IconMonitor, IconSun, IconMoon, IconCheck } from '../UI/Icons'

const OPTIONS = [
    { value: 'system', label: 'System', hint: 'Match your device', Icon: IconMonitor },
    { value: 'light', label: 'Light', hint: 'Always light', Icon: IconSun },
    { value: 'dark', label: 'Dark', hint: 'Always dark', Icon: IconMoon },
]

const ThemePicker = () => {
    const [theme, setTheme] = useTheme()

    return (
        <section id="appearance" className="card settings-section">
            <header>
                <h2>Appearance</h2>
                <p className="muted">Choose how the forum looks on this device.</p>
            </header>
            <div className="theme-options" role="radiogroup" aria-label="Theme">
                {OPTIONS.map(({ value, label, hint, Icon }) => (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={theme === value}
                        className={`theme-option ${theme === value ? 'selected' : ''}`}
                        onClick={() => setTheme(value)}
                    >
                        <span className={`theme-preview theme-preview-${value}`} aria-hidden="true">
                            <span className="tp-bar" />
                            <span className="tp-line" />
                            <span className="tp-line short" />
                        </span>
                        <span className="theme-label">
                            <Icon size={15} />
                            {label}
                            {theme === value && <IconCheck size={15} className="theme-check" />}
                        </span>
                        <span className="hint">{hint}</span>
                    </button>
                ))}
            </div>
        </section>
    )
}

export default ThemePicker
