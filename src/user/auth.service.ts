import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { TokenPayload } from 'src/common/types/token-payload.type';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService
    ){}

    async signIn(email: string, password: string){
        //Find user by email in database
        const user = await this.userService.findByEmailWithSecureInfo(email);

        //Separate salt and hashed password for comparison
        const [salt, storedHash] = user.password.split('.');

        //Hash the user given password
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //Check if database password is equal to given password
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        //Create a payload with every information stored in the access and refresh tokens 
        const payload: TokenPayload = {
         payload: { sub: user.id, email: user.email}, 
         type:'', 
         permissions: user.permissions
        };

        return this.returnTokens(payload);
    }

    async signUp(createUserDto: CreateUserDto){
        //Separates given password from the user for hashing
        const { password, ...clone } = createUserDto;

        //Generating random salt
        const salt = randomBytes(8).toString('hex');

        //Hashing the password
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //Joining salt and password for storage
        const result = salt + '.' + hash.toString('hex');

        //Create a formated User entity
        const user: CreateUserDto = {...clone, password:result};

        //Saving user with hashed password
        await this.userService.create(user);

        //Return tokens
        return this.signIn(user.email, password);
    }

    async refresh(tokenString: string){
        try{
        //Destructuring token
        const {token} = await this.jwtService.verifyAsync(tokenString);
        
        //Assing type to payload 
        const finalPayload: TokenPayload = token; 

        //Check token type
        if(finalPayload.type !== 'refresh') {
            throw 'Invalid token type';
        }

        //Search user in database
        const user = await this.userService.findOne(finalPayload.payload.sub);

        //Check if user is found
        if(!user) {
            throw 'User not found';
        }

        //Check stored refresh_token
        if(user.refresh_token !== tokenString) {
            throw 'Invalid refresh token';
        }

        //Return tokens
        return this.returnTokens(finalPayload);

        } catch(err) {
            if(err.message){
                //Handle errors thrown from JwtService
                throw new UnauthorizedException('Invalid refresh token');
            }
            //Handle errors thrown from code
            throw new UnauthorizedException(err);
        }
    }

    async signOut(token: string){
        try{
            //Verify token
            const {payload, type} = await this.jwtService.verifyAsync(token);

            //Assing type to payload
            const finalPayload: TokenPayload = payload;
    
            //Check token type
            if(type !== 'refresh') {
                throw 'Invalid token type';
            }
    
            //Search user in database
            const user = await this.userService.findOne(finalPayload.payload.sub);
    
            //Check if user is found
            if(!user) {
                throw 'User not found';
            }
    
            //Check stored refresh token
            if(user.refresh_token !== token) {
                throw 'Invalid refresh token';
            }
            
            //Reset the token in database
            await this.userService.updateToken(finalPayload.payload.sub, '');

            //Return simple message
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

    //Return the tokens and stores the refresh token to keep track of sign outs
    async returnTokens(token: TokenPayload){
        //Changes type property, hard codded to prevent changes
        token.type = 'auth';

        const acess_token = await this.jwtService.signAsync(token);

        //Changes type property, hard codded to prevent changes
        token.type = 'refresh';
        token.permissions = [];

        const refresh_token = await this.jwtService.signAsync({token},{
            expiresIn: '60h'
        })

        //Update token to match the newly created
        await this.userService.updateToken(token.payload.sub, refresh_token);

        return {
            acess_token,
            refresh_token
        };
    }
}
