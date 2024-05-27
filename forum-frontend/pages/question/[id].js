import React from 'react'
import { useRouter } from 'next/router'
import QuestionDetail from '../../components/Forum/QuestionDetail'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'

const QuestionPage = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <div>
            <Header />
            <main>
                <QuestionDetail id={id} />
            </main>
            <Footer />
        </div>
    )
}

export default QuestionPage