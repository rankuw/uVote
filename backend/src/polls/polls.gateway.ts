import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Logger, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, WsException, MessageBody, ConnectedSocket} from '@nestjs/websockets'
import { Socket, Namespace } from "socket.io"
import { WsCatchAllFilter } from 'src/exception/ws-catch-all';
import { WsAuth } from './ws-admin.gaurd';
import { PollsService } from './polls.service';

@WebSocketGateway({namespace: 'polls'})
@UseFilters(new WsCatchAllFilter())
export class PollsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(PollsGateway.name)
    
    @WebSocketServer() io: Namespace;

    constructor(private pollService: PollsService) {}

    afterInit() {
        this.logger.log('Websocket initialized');
    }

    async handleConnection(client: any) {
        const sockets = this.io.sockets;
        this.logger.log("ws client connected with socket id: ", client.id, " userId: " + client.userId)
        this.logger.log("Number of connected socket: ", sockets.size)

        await client.join(client.pollId)

        const updatedPoll = await this.pollService.joinPoll({user: client.userName, pollId: client.pollId, userId: client.userId})
        
        this.io.to(client.pollId).emit("poll_updated", updatedPoll)
    }

    async handleDisconnect(client: any) {
        const sockets = this.io.sockets;
        this.logger.log("ws client disconnected with id: ", client.id)
        this.logger.log("Number of connected socket: ", sockets.size)

        const updatedPoll = await this.pollService.removeUser(client.userId, client.pollId)
       
        this.io.to(client.pollId).emit("poll_updated", updatedPoll)
    }

    @UseGuards(WsAuth)
    @SubscribeMessage("remove")
    async removeParticipant(
        @MessageBody("id") userId: string,
        @ConnectedSocket() client
    ) {
        try{
            const updatedPoll = await this.pollService.removeUser(userId, client.pollId)
           
            this.io.to(client.pollId).emit('poll_updated', updatedPoll)
        }catch(err){
            console.log(err)
        }
    }

    @SubscribeMessage("nominations")
    async addNomination(
        @MessageBody("question") nomination: string,
        @ConnectedSocket() client
    ) {
        try{
            const updatedPoll = await this.pollService.addNomination(client.pollId, client.userId, nomination)
            
            this.io.to(client.pollId).emit('poll_updated', updatedPoll)
        }catch(err){
            console.log(err)
        }
    }

    @UseGuards(WsAuth)
    @SubscribeMessage("removeNomination")
    async removeNomination(
        @MessageBody("nominationId") id: string,
        @ConnectedSocket() client
    ) {
        try{
            const updatedPoll = await this.pollService.removeNomination(client.pollId, id)
            this.io.to(client.pollId).emit('poll_updated', updatedPoll)
        }catch(err){
            console.log(err)
        }
    }

    @UseGuards(WsAuth)
    @SubscribeMessage("startPoll")
    async startPoll(
        @ConnectedSocket() client
    ) {
        try{
            const updatedPoll = await this.pollService.startPoll(client.pollId)
            this.io.to(client.pollId).emit('poll_updated', updatedPoll)
        }catch(err){
            console.log(err)
        }
    }

    @SubscribeMessage("submitPoll")
    async submitPoll(
        @MessageBody("rankings") rankings: [string],
        @ConnectedSocket() client
    ) {
        try{
            const updatedPoll = await this.pollService.submitPoll(client.pollId, client.userId, rankings)
            this.io.to(client.pollId).emit('poll_updated', updatedPoll)
        }catch(err){
            console.log(err)
        }
    }

    @UseGuards(WsAuth)
    @SubscribeMessage("result")
    async result(
        @ConnectedSocket() client
    ) {
        try{
            const finalPoll = await this.pollService.results(client.pollId)
            this.io.to(client.pollId).emit('poll_updated', finalPoll)
        }catch(err){
            console.log(err)
        }
    }
}