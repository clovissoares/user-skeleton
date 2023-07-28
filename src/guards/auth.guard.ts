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
        const request: Request = context.switchToHttp().getRequest();

        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        if(type !== 'Bearer'){
            throw new UnauthorizedException('Invalid authorization token');
        }

        if(!token) {
            throw new UnauthorizedException('Missing authorization token');
        }

        try {
            const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: 'temp_secret' //ENV VAR
            }
            );

            if(payload.type !== 'auth'){
                throw new UnauthorizedException()
            }

            request['user'] = payload;

        } catch {
            throw new UnauthorizedException('Invalid authorization token');
        }
        return true;
    }
}