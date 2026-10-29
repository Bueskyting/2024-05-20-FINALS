import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import questionRoutes from './routes/questionRoutes.js'
import answerRoutes from './routes/answerRoutes.js'

dotenv.config()

const PORT = process.env.PORT || 5000

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error('Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill it in.')
    process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/answers', answerRoutes)

app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch(error => {
        console.error('MongoDB connection failed:', error.message)
    })
