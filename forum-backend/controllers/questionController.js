import mongoose from 'mongoose'
import Question from '../models/Question.js'
import Answer from '../models/Answer.js'

export const getQuestions = async (req, res) => {
    try {
        const [questions, stats] = await Promise.all([
            Question.find().sort({ date: -1 }).populate('user_id', 'name').lean(),
            Answer.aggregate([{ $group: { _id: '$question_id', count: { $sum: 1 }, last: { $max: '$date' } } }]),
        ])
        const statsById = new Map(stats.map((s) => [s._id.toString(), s]))

        res.status(200).json(questions.map((question) => {
            const s = statsById.get(question._id.toString())
            return { ...question, answer_count: s?.count || 0, last_activity: s?.last || question.date }
        }))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getQuestion = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Question not found' })
    try {
        const question = await Question.findById(id).populate('user_id', 'name')
        if (!question) return res.status(404).json({ message: 'Question not found' })
        res.status(200).json(question)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createQuestion = async (req, res) => {
    const { title, question_text } = req.body
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' })
    if (title.trim().length > 150) return res.status(400).json({ message: 'Title must be 150 characters or less' })
    if (!question_text?.trim()) return res.status(400).json({ message: 'Question text is required' })
    const newQuestion = new Question({ title: title.trim(), question_text: question_text.trim(), user_id: req.userId })
    try {
        await newQuestion.save()
        await newQuestion.populate('user_id', 'name')
        res.status(201).json(newQuestion)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteQuestion = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Question not found' })
    try {
        const question = await Question.findById(id)
        if (!question) return res.status(404).json({ message: 'Question not found' })
        if (question.user_id.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' })

        await Question.findByIdAndDelete(id)
        await Answer.deleteMany({ question_id: id })
        res.status(200).json({ message: 'Question deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
