import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createPollInterface, joinPollInterface } from './polls.interface';
import { createPollId, createUserId, createNominationId } from './helper';
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
        const res = await this.pollsEntity.addParticipant(joinPoll.userId, joinPoll.pollId, joinPoll.user)

        const accessToken = await this.jwtService.sign({
            pollId: joinPoll.pollId,
            userId: joinPoll.userId,
            name: joinPoll.user
        })
        return {pollData: {...res}, accessToken}
    }

    async rejoinPoll(rejoinPoll){
        const res = await this.pollsEntity.addParticipant(rejoinPoll.userId, rejoinPoll.pollId, rejoinPoll.user)
        return {pollData: {...res}}
    }

    async getPoll(pollId: string) {
        return this.pollsEntity.getPoll(pollId)
    }

    async removeUser(userId: string, pollId: string){
        const poll = await this.pollsEntity.getPoll(pollId)

        if (!poll.hasStarted){
            return this.pollsEntity.removeParticipant(userId, pollId)
        }
        
    }

    async addNomination(pollId: string, userId: string, nomination: string) {
        const nominationId = createNominationId()

        try{
            const poll = await this.pollsEntity.addNomination(pollId, userId, nominationId, nomination)
            return poll
        }catch(err){
            throw new InternalServerErrorException()
        }
    }

    async removeNomination(pollId: string, nominationId: string) {
        try{
            const poll = await this.pollsEntity.removeNomination(pollId, nominationId)
            return poll
        }catch(err){
            throw new InternalServerErrorException()
        }
    }

    async startPoll(pollId) {
        try{
            const poll = await this.pollsEntity.startPoll(pollId)
            return poll
        }catch(err){
            throw new InternalServerErrorException()
        }
    }

    async submitPoll(pollId: string, userId: string, rankings: [string]) {
        try{
            const poll = await this.pollsEntity.addRankings(pollId, userId, rankings)
            return poll
        }catch(err){
            throw new InternalServerErrorException()
        }
    }

    async results(pollId: string) {
        try{
            const poll = await this.pollsEntity.addResults(pollId)
            return poll
        }catch(err){
            throw new InternalServerErrorException()
        }
    }
}
