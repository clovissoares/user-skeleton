import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
        const request: Request = context.switchToHttp().getRequest();

        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        if(type !== 'Bearer'){
            throw 'Invalid authorization token';
        }

        if(!token) {
            throw 'Missing authorization token';
        }

        
            const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: 'temp_secret' //ENV VAR
            }
            );

            if(payload.type !== 'auth'){
                throw 'Invalid token type';
            }

            request['user'] = payload;

        } catch(err) {
            throw new UnauthorizedException(err);
        }

        return true;
    }
}