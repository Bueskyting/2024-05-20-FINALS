import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import AnswerList from './AnswerList'
import AnswerForm from './AnswerForm'

const QuestionDetail = () => {
    const router = useRouter()
    const { id } = router.query
    const [question, setQuestion] = useState(null)

    useEffect(() => {
        if (id) {
            const fetchQuestion = async () => {
                try {
                    const res = await axios.get(`/api/questions/${id}`)
                    setQuestion(res.data)
                } catch (err) {
                    console.error(err)
                }
            }

            fetchQuestion()
        }
    }, [id])

    if (!question) return <div>Loading...</div>

    return (
        <div>
            <h2>{question.question_text}</h2>
            <AnswerList questionId={id} />
            <AnswerForm questionId={id} />
        </div>
    )
}

export default QuestionDetail