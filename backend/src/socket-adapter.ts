import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class SocketAdapter extends IoAdapter {
    constructor(
        private app: INestApplicationContext,
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
        const jwtService = this.app.get(JwtService)
        const server = super.createIOServer(port, optionsWithCORS);
        
        server.of("polls").use(socketAuthMiddleware(jwtService))
        return server;
    }
}


const socketAuthMiddleware = (JwtService) => (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers["token"]
    try{
        const payload = JwtService.verify(token)
        socket.userId = payload.userId
        socket.pollId = payload.pollId
        socket.userName = payload.name
        next()
    }catch(err){
        console.log(err)
        next(new UnauthorizedException())
    }
}