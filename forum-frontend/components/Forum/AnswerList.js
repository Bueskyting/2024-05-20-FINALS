import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AnswerList = ({ questionId }) => {
    const [answers, setAnswers] = useState([])

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const res = await axios.get(`/api/questions/${questionId}/answers`)
                setAnswers(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchAnswers()
    }, [questionId])

    return (
        <div>
            <h3>Answers</h3>
            <ul>
                {answers.map((answer) => (
                    <li key={answer._id}>
                        {answer.answer_text}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AnswerList