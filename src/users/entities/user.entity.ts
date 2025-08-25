import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm"

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
