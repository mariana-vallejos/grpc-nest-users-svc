import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  type CreateUserRequest,
  type DeleteUserRequest,
  type Empty,
  GenericResponse,
  type GetUserByIdRequest,
  type UpdateUserRequest,
  USER_SERVICE_NAME,
} from './user.pb';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<GenericResponse> {
    try {
      const dto = plainToInstance(CreateUserDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}).join(', '))
          .join('; ');
        throw new RpcException({
          code: 4,
          message: messages,
        });
      }

      const user = await this.usersService.createUser(data);

      return {
        status: 201,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at.toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetAllUsers')
  async getAllUsers(_: Empty): Promise<GenericResponse> {
    return this.usersService.getAllUsers();
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  getUserById(data: GetUserByIdRequest): Promise<GenericResponse> {
    return this.usersService.getUserById(data);
  }

  // @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  // updateUser(data: UpdateUserRequest): Promise<UserResponse> {
  //   return this.usersService.updateUser(data);
  // }

  // @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  // deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
  //   return this.usersService.deleteUser(data);
  // }
}
