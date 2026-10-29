const UNITS = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
]

export const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    for (const [unit, size] of UNITS) {
        const n = Math.floor(seconds / size)
        if (n >= 1) return `${n} ${unit}${n > 1 ? 's' : ''} ago`
    }
    return 'just now'
}

export const fullDate = (date) => new Date(date).toLocaleString()

export const plural = (n, singular, pluralForm = `${singular}s`) => `${n} ${n === 1 ? singular : pluralForm}`

// Older questions were created before titles existed, so fall back to the first line of the text
export const threadTitle = (question) => {
    if (question.title) return question.title
    const firstLine = question.question_text.split('\n')[0]
    return firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine
}

export const threadExcerpt = (question) => (question.title ? question.question_text.replace(/\s+/g, ' ') : '')
