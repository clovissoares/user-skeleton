import {Column, Entity } from 'typeorm';

import { Base } from 'src/common/entities/base.entity';
import Permission from 'src/common/types/premission.type';

@Entity()
export class User extends Base {

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    //Only visible if you explicitly ask for it in a query builder
    @Column({select: false})
    password: string;

    @Column({
        select: false,
        default:""
    })
    refresh_token: string;

    //Only visible if you explicitly ask for it in a query builder
    @Column({
        type:'enum',
        enum: Permission,
        array: true,
        default:[],
        select: false
    })
    permissions: Permission[];
}