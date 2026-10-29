import express from 'express'
import { deleteAnswer, likeAnswer } from '../controllers/answerController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Listing and creating answers lives under /api/questions/:id/answers (see questionRoutes.js)
router.post('/:id/like', authMiddleware, likeAnswer)
router.delete('/:id', authMiddleware, deleteAnswer)

export default router
