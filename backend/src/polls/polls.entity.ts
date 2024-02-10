import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { IORedisKey } from "src/redis.module";

@Injectable()
export class PollEntity {

    private readonly ttl: string
    private readonly logger = new Logger(PollEntity.name)
    // check why ttl is going -2
    constructor(
        private configService: ConfigService,
        @Inject(IORedisKey) private readonly RedisClient: Redis
    ) {
        this.ttl = configService.get("REDIS_TTL")
    }

    async createPoll(
        userId: string,
        pollId: string,
        noOfVotes: number,
        question: string
    ){
        try{
            const key = "pollId:" + pollId;
            const data = {
                userId, 
                pollId, 
                noOfVotes, 
                question,
                adminId: userId,
                participants: []
            }
            const res = await this.RedisClient.setex(key, this.ttl, JSON.stringify(data))
            return data;
        }catch(err){
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }

    async getPoll(pollId: string) {
        try{
            const key = "pollId:" + pollId
            const poll = await this.RedisClient.get(key)
            return JSON.parse(poll)
        }catch(err){
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }

    async addParticipant(userId: string, pollId){
        try{
            const poll = await this.getPoll(pollId)
            poll.participants.push(userId)
            console.log(poll)
            const res = await this.RedisClient.setex("pollId:" + pollId, this.ttl, JSON.stringify(poll))
            return poll
        }catch(err){
            this.logger.error(err)
            throw new InternalServerErrorException()
        } 
    }
}