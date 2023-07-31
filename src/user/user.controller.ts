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
    Query,
 } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ){}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto).catch(err => {
            //Handles errors thrown from TypeORM
           throw new BadRequestException(err.detail.replaceAll('(',' ').replaceAll(')',' '));
        });
    }

    @Get(':id')
    //@UseGuards(AuthGuard)
    findOne(@Param('id') id: string){
        return this.userService.findOne(id);
    }

    @Get()
    findAll(@Query() paginationQueryDto: PaginationQueryDto){
        return this.userService.findAll(paginationQueryDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.userService.remove(id);
    }

    @Post('auth/signIn')
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('auth/signUp')
    signUp(@Body() createUserDto: CreateUserDto){
        return this.authService.signUp(createUserDto);
    }

    @Post('auth/refresh')
    refresh(@Body() token: RefreshTokenDto){
        return this.authService.refresh(token.refresh_token);
    }

    @Post('auth/signOut')
    signOut(@Body() token: RefreshTokenDto){
        return this.authService.signOut(token.refresh_token);
    }
}

