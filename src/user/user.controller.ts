import { 
    Controller, 
    Param, 
    Body, 
    Get, 
    Post, 
    Patch, 
    Delete, 
    BadRequestException,
    UseGuards,
    Request,
 } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ){}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto).catch(err => {
            throw new BadRequestException(err.detail.replaceAll('(',' ').replaceAll(')',' '));
        });
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id: string){
        return this.userService.findOne(id);
    }

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.userService.remove(id);
    }

    @Post('auth')
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('auth/refresh')
    refresh(@Body() token: RefreshTokenDto){
        return this.authService.refresh(token.refresh_token);
    }
}

