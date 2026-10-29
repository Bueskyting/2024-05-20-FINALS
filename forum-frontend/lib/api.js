import axios from 'axios'
import { getToken, clearAuth } from './auth'

// All requests go to /api, which next.config.mjs forwards to the Express backend
const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        // Expired or invalid token: log the user out so they can log in again
        if (err.response?.status === 403 && err.response?.data?.message === 'Invalid token') clearAuth()
        return Promise.reject(err)
    }
)

export const errorMessage = (err, fallback) => err.response?.data?.message || fallback

export default api
