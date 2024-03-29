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

export interface Poll {
    id: string,
    adminId: string,
    participants: [{}],
    hasStarted: boolean,
    question: string,
    noOfVotes: number,
    nominations: {},
    rankings: {},
    results: []
}