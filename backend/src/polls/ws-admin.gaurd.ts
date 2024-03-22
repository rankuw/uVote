import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WsBadRequestException } from "src/exception/ws-exception";
import { PollsService } from "./polls.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class WsAuth implements CanActivate {
    constructor(
        private readonly pollsService: PollsService,
        private readonly jwtService: JwtService,
    ){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            const socket = context.switchToWs().getClient()
            const token =
                socket.handshake.auth.token || socket.handshake.headers['token'];
            if (!token) {
                throw new WsBadRequestException('No token provided');
            }

            const payload = this.jwtService.verify(
                token,
            );

            const pollsDetails = await this.pollsService.getPoll(payload.pollId)
        
            if (payload.userId !== pollsDetails.adminId) {
                throw new WsBadRequestException('Admin privileges required');
            }
        
            return true;
        }catch(err){
            throw err
        }
    }
    
}