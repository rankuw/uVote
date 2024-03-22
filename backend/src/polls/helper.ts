import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)

export const createPollId = () => nanoid()

export const createUserId = () => nanoid(8)

export const createNominationId = () => nanoid(8)

export const resultAlgo = (rankings, noOfVotes, nominations) => {
    const scores = {}
    Object.values(rankings).forEach((nominationIds: []) => {
        nominationIds.forEach((nominationId, indx) => {
            const score = Math.pow(
                (noOfVotes - 0.5 * indx) / noOfVotes,
                indx + 1,
            );

            scores[nominationId] = scores[nominationId] ?? 0 + score
        }) 
    })
    const score = Object.entries(scores).map(([nominationId, score]) => {
        return {
            nominationId,
            nomination: nominations[nominationId].nomination,
            score
        }
    })

    return score
}