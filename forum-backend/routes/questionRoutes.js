import express from 'express'
import { getQuestions, createQuestion, deleteQuestion } from '../controllers/questionController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getQuestions)
router.post('/', authMiddleware, createQuestion)
router.delete('/:id', authMiddleware, deleteQuestion)

export default router