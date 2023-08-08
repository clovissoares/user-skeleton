import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity'
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ){}

    async create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        
        return await this.userRepository.save(user);
    }

    async findOne(id : string) {
       const user = await this.userRepository.findOne({where: {id}})

       if (!user) {
        throw new NotFoundException(`User ${id} not found`);
       }

        return user;
    }

    //Only function that returns the password
    async findByEmailWithSecureInfo(email: string){
        const user = await this.userRepository
        .createQueryBuilder()
        .select("user")
        .addSelect("user.password")
        .addSelect("user.permissions")
        .from(User, "user")
        .where("user.email = :email", {email})
        .getOne()

        //Check if user is found
        if(!user){
            throw new NotFoundException(`User ${email} does not exists.`);
        }

        return user;
    }

    async findOneWithToken(id: string) {
        const user = await this.userRepository
        .createQueryBuilder()
        .select("user")
        .addSelect("user.refresh_token")
        .from(User, "user")
        .where("user.id = :id", {id})
        .getOne()

        //Check if user is found
        if(!user){
            throw new NotFoundException(`User ${id} does not exists.`);
        }

        return user;
    }

    async findAll(paginationQueryDto: PaginationQueryDto){
    const { limit, offset } = paginationQueryDto;

    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
    }

    async profile(id: string){
        const user = await this.userRepository.findOne({where: {id}})

        if (!user) {
         throw new NotFoundException(`User ${id} not found`);
        }
 
         return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto){
        //Check if user is tring to update password
        if(updateUserDto.password) {
          throw new BadRequestException('Cannot update password field');    
        }

        const user = await this.userRepository.preload({id, ...updateUserDto}); 

        if(!user){
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.userRepository.save(user);
    }

    async updateToken(id: string, refresh_token: string){
        const user = await this.userRepository.preload({id, refresh_token});

        if(!user){
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.userRepository.save(user);
    }

    async remove(id: string){
        const user = await this.findOne(id);

        if(!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return this.userRepository.remove(user);
    }
}
