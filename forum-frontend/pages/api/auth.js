import dbConnect from '../../lib/dbConnect'
import User from '../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dbConnect()

export default async (req, res) => {
    const { method } = req

    if (method === 'POST' && req.url === '/api/auth/register') {
        const { email, password, name } = req.body

        try {
            const existingUser = await User.findOne({ email })
            if (existingUser) return res.status(400).json({ message: 'User already exists' })

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = await User.create({ email, password: hashedPassword, name })

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

            res.status(201).json({ result: user, token });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    } else if (method === 'POST' && req.url === '/api/auth/login') {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ email })
            if (!user) return res.status(404).json({ message: 'User doesn\'t exist' })

            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' })

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

            res.status(200).json({ result: user, token })
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}