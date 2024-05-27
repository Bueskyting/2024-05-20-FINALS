import React from 'react'
import Link from 'next/link'

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/auth">Register/Login</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header