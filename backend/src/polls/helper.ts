import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)

export const createPollId = () => nanoid()

export const createUserId = () => nanoid(8)