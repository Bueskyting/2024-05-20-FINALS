import React from 'react'
import { useRouter } from 'next/router'
import QuestionDetail from '../../components/Forum/QuestionDetail'
import Layout from '../../components/Layout/Layout'

const QuestionPage = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <Layout title="Thread">
            <QuestionDetail id={id} />
        </Layout>
    )
}

export default QuestionPage
