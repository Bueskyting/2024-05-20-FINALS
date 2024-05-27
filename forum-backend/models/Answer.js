import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
    answer_text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    gained_likes_number: { type: Number, default: 0 },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.model('Answer', answerSchema)