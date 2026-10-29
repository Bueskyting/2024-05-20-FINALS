import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Question from '../models/Question.js'
import Answer from '../models/Answer.js'

const MIN_PASSWORD_LENGTH = 6

// Never send the password hash back to the client
const publicUser = (user) => ({ _id: user._id, email: user.email, name: user.name })

const signToken = (user) =>
    jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

export const register = async (req, res) => {
    const { email, password, name } = req.body
    if (!email || !password || !name) return res.status(400).json({ message: 'Email, password and name are required' })
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await User.create({ email, password: hashedPassword, name })

        res.status(201).json({ result: publicUser(result), token: signToken(result) })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(404).json({ message: 'User doesn\'t exist' })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' })

        res.status(200).json({ result: publicUser(existingUser), token: signToken(existingUser) })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// Profile of the logged-in user plus a few activity numbers
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const [threads, replies, likes] = await Promise.all([
            Question.countDocuments({ user_id: user._id }),
            Answer.countDocuments({ user_id: user._id }),
            Answer.aggregate([
                { $match: { user_id: user._id } },
                { $group: { _id: null, total: { $sum: '$gained_likes_number' } } },
            ]),
        ])

        res.status(200).json({
            ...publicUser(user),
            joined: user._id.getTimestamp(),
            stats: { threads, replies, likes: likes[0]?.total || 0 },
        })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// Change name and/or email. Returns a fresh token because the email is part of it.
export const updateMe = async (req, res) => {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim()
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' })
    if (name.length > 50) return res.status(400).json({ message: 'Name can be at most 50 characters' })
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address' })
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        if (email !== user.email && (await User.exists({ email }))) {
            return res.status(400).json({ message: 'That email is already in use' })
        }

        user.name = name
        user.email = email
        await user.save()
        res.status(200).json({ result: publicUser(user), token: signToken(user) })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const changePassword = async (req, res) => {
    const { current_password, new_password } = req.body
    if (!current_password || !new_password) return res.status(400).json({ message: 'Current and new password are required' })
    if (new_password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters` })
    }
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isPasswordCorrect = await bcrypt.compare(current_password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Current password is incorrect' })

        user.password = await bcrypt.hash(new_password, 12)
        await user.save()
        res.status(200).json({ message: 'Password updated' })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// Deletes the account with everything the user posted and the likes they gave
export const deleteMe = async (req, res) => {
    const { password } = req.body
    if (!password) return res.status(400).json({ message: 'Password is required' })
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Password is incorrect' })

        const questionIds = await Question.find({ user_id: user._id }).distinct('_id')
        await Answer.deleteMany({ $or: [{ user_id: user._id }, { question_id: { $in: questionIds } }] })
        await Question.deleteMany({ user_id: user._id })
        await Answer.updateMany(
            { liked_by: user._id },
            { $pull: { liked_by: user._id }, $inc: { gained_likes_number: -1 } }
        )
        await User.findByIdAndDelete(user._id)

        res.status(200).json({ message: 'Account deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}
