import React, { useState } from 'react'
import axios from 'axios'

const AnswerForm = ({ questionId }) => {
    const [answerText, setAnswerText] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`/api/questions/${questionId}/answers`, { answer_text: answerText })
            console.log(res.data)
            setAnswerText('')

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                name="answer"
                placeholder="Your answer"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
            />
            <button type="submit">Submit Answer</button>
        </form>
    )
}

export default AnswerForm