import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestWithAuthToken } from '../types/request-with-auth-token.type';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: RequestWithAuthToken = context.switchToHttp().getRequest();

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
                secret: this.configService.get<string>('JWT_SECRET')
            }
            );

            if(payload.type !== 'auth'){
                throw 'Invalid token type';
            }
            
            request.user = payload;
            
            return true;
        } catch(err) {
            throw new UnauthorizedException(err);
        }
    }
}