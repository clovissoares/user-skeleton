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

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard'
import { SetPermission } from 'src/common/decorators/permission.decorator';
import  Permission from 'src/common/types/premission.type';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayload } from 'src/common/types/token-payload.type';



@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ){}

    @Post()
    @SetPermission(Permission.CreateUser)
    async createUser(@Body() createUserDto: CreateUserDto){
        return await this.usersService.create(createUserDto).catch(err => {
            //Handle errors thrown from TypeORM
           throw new BadRequestException(err.detail.replaceAll('(',' ').replaceAll(')',' '));
        });
    }

    @Get('/profile')
    @SetPermission(Permission.Profile)
    @UseGuards(AuthGuard, PermissionGuard)
    profile(@User() user: TokenPayload){
        return this.usersService.profile(user.payload.sub);
    }

    @Get(':id')
    @SetPermission(Permission.FindUser)
    findOne(@Param('id') id: string){
        return this.usersService.findOne(id);
    }

    @Get()
    @SetPermission(Permission.FindUsers)
    @UseGuards(AuthGuard, PermissionGuard)
    findAll(@Query() paginationQueryDto: PaginationQueryDto){
        return this.usersService.findAll(paginationQueryDto);
    }

    @Patch(':id')
    @SetPermission(Permission.UpdateUser)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return await this.usersService.update(id, updateUserDto).catch(err => {
            //Handle errors thrown from TypeORM
           throw new BadRequestException(err.detail.replaceAll('(',' ').replaceAll(')',' '));
        });
    }

    @Delete(':id')
    @SetPermission(Permission.DeleteUser)
    remove(@Param('id') id: string){
        return this.usersService.remove(id);
    }

    @Post('auth/signIn')
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('auth/signUp')
    async signUp(@Body() createUserDto: CreateUserDto){
        return await this.authService.signUp(createUserDto).catch(err => {
            //Handle errors thrown from TypeORM
           throw new BadRequestException(err.detail.replaceAll('(',' ').replaceAll(')',' '));
        });
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

