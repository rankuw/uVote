import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, WsException} from '@nestjs/websockets'
import { Socket, Namespace } from "socket.io"
import { WsCatchAllFilter } from 'src/exception/ws-catch-all';

@WebSocketGateway({namespace: 'polls'})
@UseFilters(new WsCatchAllFilter())
export class PollsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(PollsGateway.name)
    
    @WebSocketServer() io: Namespace;

    afterInit() {
        this.logger.log('Websocket initialized');
    }

    handleConnection(client: any) {
        const sockets = this.io.sockets;
        this.io.emit("hello", "OOOOOOOOOOO")
        this.logger.log("ws client connected with socket id: ", client.id, " userId: " + client.userId)
        this.logger.log("Number of connected socket: ", sockets.size)
    }

    handleDisconnect(client: Socket) {
        const sockets = this.io.sockets;
        this.logger.log("ws client disconnected with id: ", client.id)
        this.logger.log("Number of connected socket: ", sockets.size)
    }

    @SubscribeMessage("test")
    print() {
        throw new BadRequestException("OOOO")
    }
}