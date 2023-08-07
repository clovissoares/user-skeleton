import Permission from 'src/common/types/premission.type';
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    //Only visible if you explicitly ask for it in a query builder
    @Column({select: false})
    password: string;

    @Column({default:""})
    refresh_token: string;

    @Column({
        type:'enum',
        enum: Permission,
        array: true,
        default:[],
        select: false
    })
    permissions: Permission[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}