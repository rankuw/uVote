import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto, JoinPollDto } from './polls.dto';
import { AuthGuard } from './auth.gaurd';

@Controller('polls')
export class PollsController {
    constructor(private pollsService: PollsService){}

    @Post()
    async create(@Body() createPoll: CreatePollDto){
        console.log(createPoll)
        return await this.pollsService.createPoll(createPoll)
    }

    @Post("/join")
    async join(@Body() joinPoll: JoinPollDto){
        return await this.pollsService.joinPoll(joinPoll)
    }

    @UseGuards(AuthGuard)
    @Post("/rejoin")
    async rejoin(@Request() req){
        return await this.pollsService.rejoinPoll(req.user)
    }

    @Get("/:pollId")
    async getPoll(@Param("pollId") pollId: string){
        return await this.pollsService.getPoll(pollId)
    }
}
