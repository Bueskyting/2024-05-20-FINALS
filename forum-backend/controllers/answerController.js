import mongoose from 'mongoose'
import Answer from '../models/Answer.js'
import Question from '../models/Question.js'

export const getAnswers = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Question not found' })
    try {
        const answers = await Answer.find({ question_id: id }).sort({ date: 1 }).populate('user_id', 'name')
        res.status(200).json(answers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createAnswer = async (req, res) => {
    const { answer_text } = req.body
    const { id } = req.params
    if (!answer_text?.trim()) return res.status(400).json({ message: 'Answer text is required' })
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Question not found' })
    try {
        const question = await Question.findById(id)
        if (!question) return res.status(404).json({ message: 'Question not found' })

        const newAnswer = new Answer({ answer_text: answer_text.trim(), question_id: id, user_id: req.userId })
        await newAnswer.save()
        await newAnswer.populate('user_id', 'name')
        res.status(201).json(newAnswer)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Toggles the current user's like on an answer
export const likeAnswer = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Answer not found' })
    try {
        const answer = await Answer.findById(id)
        if (!answer) return res.status(404).json({ message: 'Answer not found' })
        if (answer.user_id.toString() === req.userId) return res.status(403).json({ message: 'You can\'t like your own answer' })

        const liked = answer.liked_by.some((userId) => userId.toString() === req.userId)
        if (liked) answer.liked_by.pull(req.userId)
        else answer.liked_by.push(req.userId)
        answer.gained_likes_number = answer.liked_by.length
        await answer.save()

        res.status(200).json({ gained_likes_number: answer.gained_likes_number, liked: !liked })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteAnswer = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Answer not found' })
    try {
        const answer = await Answer.findById(id)
        if (!answer) return res.status(404).json({ message: 'Answer not found' })
        if (answer.user_id.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' })

        await Answer.findByIdAndDelete(id)
        res.status(200).json({ message: 'Answer deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
