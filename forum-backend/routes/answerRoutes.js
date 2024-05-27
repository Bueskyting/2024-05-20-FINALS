import express from 'express'
import { getAnswers, createAnswer, deleteAnswer } from '../controllers/answerController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:id/answers', getAnswers)
router.post('/:id/answers', authMiddleware, createAnswer)
router.delete('/answer/:id', authMiddleware, deleteAnswer)

export default router