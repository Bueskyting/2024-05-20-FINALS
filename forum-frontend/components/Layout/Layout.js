import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title ? `${title} · Forum` : 'Forum'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <main className="container">{children}</main>
            <Footer />
        </>
    )
}

export default Layout
