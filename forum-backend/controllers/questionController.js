import Question from '../models/Question.js'

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('user_id', 'name')
        res.status(200).json(questions)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createQuestion = async (req, res) => {
    const { question_text } = req.body
    const user_id = req.userId
    const newQuestion = new Question({ question_text, user_id })
    try {
        await newQuestion.save()
        res.status(201).json(newQuestion)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const deleteQuestion = async (req, res) => {
    const { id } = req.params
    try {
        const question = await Question.findById(id)
        if (!question) return res.status(404).json({ message: 'Question not found' })
        if (question.user_id.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' })

        await Question.findByIdAndRemove(id)
        res.status(200).json({ message: 'Question deleted successfully' })
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}