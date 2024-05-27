import React from 'react'
import QuestionList from '../components/Forum/QuestionList'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const Main = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Broken Forum</h1>
                <QuestionList />
            </main>
            <Footer />
        </div>
    )
}

export default Main