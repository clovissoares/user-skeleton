import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

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
            throw new BadRequestException(`Password does not match.`);
        }

        const payload = { sub: user.id, email: user.email};

        const refresh_token = await this.jwtService.signAsync({payload, type: 'refresh'},{
            expiresIn: '60h'
        })

        await this.userService.updateToken(payload.sub, refresh_token);

        return {
            acess_token: await this.jwtService.signAsync({payload, type: 'auth'}),
            refresh_token: refresh_token
        };
    }

    async signUp(createUserDto: CreateUserDto){
        const user = await this.userService.create(createUserDto);

        return this.signIn(user.email, user.password);
    }

    async refresh(token: string){
        try{
        const {payload, type} = await this.jwtService.verifyAsync(token);

        if(type !== 'refresh') {
            throw 'Invalid token type';
        }

        const user = await this.userService.findOne(payload['sub']);

        if(!user) {
            throw 'User not found';
        }

        if(user.refresh_token !== token) {
            throw 'Invalid refresh token';
        }

        const refresh_token = await this.jwtService.signAsync({payload, type: 'refresh'},{
            expiresIn: '60h'
        })

        await this.userService.updateToken(payload.sub, refresh_token);

        return {
            acess_token: await this.jwtService.signAsync({payload, type: 'auth'}),
            refresh_token: refresh_token
        };

        } catch(err) {
            if(err.message){
                //Handles errors thrown from JwtService
                throw new UnauthorizedException('Invalid refresh token');
            }
            //Handles errors thrown from code
            throw new UnauthorizedException(err);
        }
    }

    async signOut(token: string){
        try{
            const {payload, type} = await this.jwtService.verifyAsync(token);
    
            if(type !== 'refresh') {
                throw 'Invalid token type';
            }
    
            const user = await this.userService.findOne(payload['sub']);
    
            if(!user) {
                throw 'User not found';
            }
    
            if(user.refresh_token !== token) {
                throw 'Invalid refresh token';
            }
            
            await this.userService.updateToken(payload.sub, '');

            return {"message":"User signed out succeeded"}

        } catch(err) {
            if(err.message){
                //Handles errors thrown from JwtService
                throw new UnauthorizedException('Invalid refresh token');
            }
            //Handles errors thrown from code
            throw new UnauthorizedException(err);
        }
    }
}
