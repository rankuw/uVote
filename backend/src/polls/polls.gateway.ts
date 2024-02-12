import { Logger } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit} from '@nestjs/websockets'

@WebSocketGateway({namespace: 'polls'})
export class PollsGateway implements OnGatewayInit {
    private readonly logger = new Logger(PollsGateway.name)
    afterInit() {
        this.logger.log('Websocket initialized');
    }

}