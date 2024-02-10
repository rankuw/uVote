import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { PollsService } from "./polls.service";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService, private configService: ConfigService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            const request = context.switchToHttp().getRequest()
            const [type, token] = request.headers.authorization?.split(' ') ?? []
            if(type != "Bearer"){
                throw new UnauthorizedException()
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            })

            request["user"] = payload;
            return true
        }catch(err){
            throw new UnauthorizedException()
        }
    }

    
}