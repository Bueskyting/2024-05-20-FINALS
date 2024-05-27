import dbConnect from '../../lib/dbConnect'
import Question from '../../models/Question'
import authMiddleware from '../../middleware/authMiddleware'

dbConnect()

export default async (req, res) => {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const questions = await Question.find({})
                res.status(200).json(questions)
            } catch (error) {
                res.status(500).json({ message: 'Something went wrong' })
            }
            break
        case 'POST':
            authMiddleware(req, res, async () => {
                const { question_text } = req.body
                const newQuestion = new Question({ question_text, user_id: req.userId })

                try {
                    const question = await newQuestion.save()
                    res.status(201).json(question)
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