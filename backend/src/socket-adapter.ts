import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class SocketAdapter extends IoAdapter {
    constructor(
        app: INestApplicationContext,
        private configService: ConfigService,
    ) {
        super(app)
    }
    
    createIOServer(port: number, options?: ServerOptions) {
        const clientPort = parseInt(this.configService.get('CLIENT_PORT'));
        const cors = {
            origin: [
                `http://localhost:${clientPort}`
            ],
        };
        
        const optionsWithCORS: ServerOptions = {
            ...options,
            cors
        };
    
        const server = super.createIOServer(port, optionsWithCORS);
        return server;
    }
}