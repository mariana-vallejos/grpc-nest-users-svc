import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { CreateUserRequest } from "../user.pb"

export class CreateUserDto implements CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string
}
