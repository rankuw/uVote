import { Injectable } from '@nestjs/common';
import { createPollInterface, joinPollInterface } from './polls.interface';
import { createPollId, createUserId } from './helper';
import { PollEntity } from './polls.entity';
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class PollsService {

    constructor(private pollsEntity: PollEntity, private jwtService: JwtService) {}
    
    async createPoll(createPoll: createPollInterface){
        const pollId = createPollId()
        const userId = createUserId()

        const res = await this.pollsEntity.createPoll(userId, pollId, createPoll.noOfVotes, createPoll.question)
        const accessToken = await this.jwtService.sign(
            {
                pollId,
                userId,
                name: createPoll.user
            }
        )
        return {pollData: {...res, pollId, userId}, accessToken};
    }

    async joinPoll(joinPoll: joinPollInterface){
        if(!joinPoll.userId){
            joinPoll.userId = createUserId()
        }
        const res = await this.pollsEntity.addParticipant(joinPoll.userId, joinPoll.pollId)

        const accessToken = await this.jwtService.sign({
            pollId: joinPoll.pollId,
            userId: joinPoll.userId,
            name: joinPoll.user
        })
        return {pollData: {...res}, accessToken}
    }

    async rejoinPoll(rejoinPoll){
        const res = await this.pollsEntity.addParticipant(rejoinPoll.userId, rejoinPoll.pollId)
        return {pollData: {...res}}
    }

    async getPoll(pollId: string) {
        return this.pollsEntity.getPoll(pollId)
    }
}
