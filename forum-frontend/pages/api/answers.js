import dbConnect from '../../lib/dbConnect.js'
import Answer from '../../models/Answer.js'
import authMiddleware from '../../middleware/authMiddleware.js'

dbConnect()

export default async (req, res) => {
    const { method } = req

    switch (method) {
        case 'GET':
            const { id } = req.query
            try {
                const answers = await Answer.find({ question_id: id })
                res.status(200).json(answers)
            } catch (error) {
                res.status(500).json({ message: 'Something went wrong' })
            }
            break
        case 'POST':
            authMiddleware(req, res, async () => {
                const { answer_text } = req.body
                const { id } = req.query
                const newAnswer = new Answer({ answer_text, question_id: id, user_id: req.userId })

                try {
                    const answer = await newAnswer.save()
                    res.status(201).json(answer)
                } catch (error) {
                    res.status(500).json({ message: 'Something went wrong' })
                }
            })
            break
        default:
            res.status(405).json({ message: 'Method not allowed' })
            break
    }
}