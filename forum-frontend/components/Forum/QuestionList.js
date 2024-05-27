import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const QuestionList = () => {
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('/api/questions')
                setQuestions(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchQuestions()
    }, [])

    return (
        <div>
            <h2>Questions</h2>
            <ul>
                {questions.map((question) => (
                    <li key={question._id}>
                        <Link href={`/question/${question._id}`}>{question.question_text}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default QuestionList