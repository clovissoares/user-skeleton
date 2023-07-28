import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService
    ){}

    async signIn(email: string, password: string){

        const user = await this.userService.findByEmail(email);

        if(!user){
            throw new BadRequestException(`User ${email} does not exists.`);
        }

        if(user.password !== password){
            throw new UnauthorizedException(`Password does not match.`);
        }

        const payload = { sub: user.id, email: user.email};

        
        return {
            acess_token: await this.jwtService.signAsync({payload, type: 'auth'}),
            refresh_token: await this.jwtService.signAsync({payload, type: 'refresh'},{
                expiresIn: '60h'
            })
        };
    }

    async refresh(token: string){
        try{
        const {payload, type} = await this.jwtService.verifyAsync(token);

        if(type !== 'refresh') {
            throw new UnauthorizedException();
        }

        return {
            acess_token: await this.jwtService.signAsync({payload, type: 'auth'}),
            refresh_token: await this.jwtService.signAsync({payload, type: 'refresh'},{
                expiresIn: '60h'
            })
        };

        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
