import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @CreateDateColumn()
    created_at: Date
}
