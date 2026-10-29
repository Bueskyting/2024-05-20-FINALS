import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <p>© {new Date().getFullYear()} Forum. All rights reserved.</p>
                <p>
                    Be kind, stay on topic, help each other out. · <Link href="/settings#appearance">Theme</Link>
                </p>
            </div>
        </footer>
    )
}

export default Footer
