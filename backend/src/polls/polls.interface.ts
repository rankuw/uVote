export interface createPollInterface{
    user: string,
    question: string,
    noOfVotes: number
}

export interface joinPollInterface{
    user: string,
    pollId: string,
    userId?: string
}