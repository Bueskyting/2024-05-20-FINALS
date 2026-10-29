import express from 'express'
import { getQuestions, getQuestion, createQuestion, deleteQuestion } from '../controllers/questionController.js'
import { getAnswers, createAnswer } from '../controllers/answerController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getQuestions)
router.post('/', authMiddleware, createQuestion)
router.get('/:id', getQuestion)
router.delete('/:id', authMiddleware, deleteQuestion)

router.get('/:id/answers', getAnswers)
router.post('/:id/answers', authMiddleware, createAnswer)

export default router
