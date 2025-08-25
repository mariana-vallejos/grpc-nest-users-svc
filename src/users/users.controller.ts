import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import { type CreateUserRequest, type DeleteUserRequest, type DeleteUserResponse, type GetUserByIdRequest, type UpdateUserRequest, USER_SERVICE_NAME, type UserListResponse, type UserResponse } from './user.pb';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  createUser(data: CreateUserRequest): Promise<UserResponse> {
    return this.usersService.createUser(data);
  }

  // @GrpcMethod(USER_SERVICE_NAME, 'GetAllUsers')
  // getAllUsers(): Promise<UserListResponse> {
  //   return this.usersService.getAllUsers();
  // }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  getUserById(data: GetUserByIdRequest): Promise<UserResponse> {
    return this.usersService.getUserById(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  updateUser(data: UpdateUserRequest): Promise<UserResponse> {
    return this.usersService.updateUser(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
    return this.usersService.deleteUser(data);
  }
}
